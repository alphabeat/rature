// Stress run of the post-NER steps on tricky text (`cases.ts`) and, optionally, local PDFs.
// Runs the real model and the real `TokenClassificationModel.process()` in a child process
// (`case.ts`), one case at a time, and reports per case: a stall (no result within the timeout, with the step it hung in),
// an error, a slow post-NER step, entities whose offsets do not point at their text, and expected
// entities that were not found. Exits 1 if any case fails.
//
//   bun run stress:ner                      # all cases, bertBaseNer (the app default)
//   bun run stress:ner --model camembertNerPii --only urls,unicode
//   bun run stress:ner --pdf ~/Downloads/a.pdf --pdf scripts/ner-stress/pdf/form-leaders.pdf
//
// Documents stay on this machine: the only network call is the first model download.
import { parseArgs } from 'node:util';

import { extractTextFromPDF } from '../../src/lib/pdf/processPDF.ts';
import { CUSTOM_PAGE_SPLIT_TOKEN, joinPagesForNer, NER_MODELS_NAMES, type NERModel } from '../../src/models/utils.ts';
import type { GroupedEntity } from '../../src/types/index.ts';
import { CASES, type StressCase } from './cases.ts';

const { values } = parseArgs({
  options: {
    model: { type: 'string', default: 'bertBaseNer' },
    only: { type: 'string' },
    pdf: { type: 'string', multiple: true, default: [] },
    timeout: { type: 'string', default: '120000' },
    'step-budget': { type: 'string', default: '1000' },
  },
});

const model = values.model as NERModel;
if (!NER_MODELS_NAMES.includes(model)) throw new Error(`Unknown model ${model}`);
const timeoutMs = Number(values.timeout);
const stepBudgetMs = Number(values['step-budget']);

const cases: StressCase[] = values.only ? CASES.filter((c) => values.only!.split(',').includes(c.name)) : [...CASES];
for (const path of values.pdf) {
  const result = await extractTextFromPDF(await Bun.file(path).arrayBuffer());
  if (!result.success) throw new Error(`Cannot read ${path}`);
  cases.push({ name: `pdf:${path.split('/').pop()}`, pages: result.pages.map((p) => p.text) });
}

type Outcome = { status: 'result'; entities: GroupedEntity[]; steps: [string, number][] }
  | { status: 'error'; name: string; message: string; stack?: string; steps: [string, number][] }
  | { status: 'stall'; steps: [string, number][] };

const scratch = `${process.env.TMPDIR ?? '/tmp'}/ner-stress-${process.pid}.txt`;

// Runs a command, handing each JSON line of its stdout to `onLine`; killed after `timeoutMs`.
async function runJsonLines(cmd: string[], onLine: (data: Record<string, never>) => void) {
  const child = Bun.spawn(cmd, { stdout: 'pipe', stderr: 'ignore' });
  let timedOut = false;
  const timer = setTimeout(() => { timedOut = true; child.kill(); }, timeoutMs);
  const decoder = new TextDecoder();
  let buffer = '';
  for await (const chunk of child.stdout) {
    buffer += decoder.decode(chunk, { stream: true });
    let newline;
    while ((newline = buffer.indexOf('\n')) >= 0) {
      const line = buffer.slice(0, newline);
      buffer = buffer.slice(newline + 1);
      if (line.startsWith('{')) onLine(JSON.parse(line));
    }
  }
  await child.exited;
  clearTimeout(timer);
  return { timedOut, exitCode: child.exitCode };
}

async function runCase(text: string): Promise<Outcome> {
  await Bun.write(scratch, text);
  const steps: [string, number][] = [];
  let outcome: Outcome | null = null;
  const { timedOut, exitCode } = await runJsonLines(['bun', '--tsconfig-override', 'tsconfig.app.json', `${import.meta.dir}/case.ts`, model, scratch], (data) => {
    if (data.type === 'step') steps.push([data.step, data.at]);
    if (data.type === 'result') outcome = { status: 'result', entities: data.entities, steps };
    if (data.type === 'error') outcome = { status: 'error', name: data.name, message: data.message, stack: data.stack, steps };
  });
  if (outcome) return outcome;
  if (timedOut) return { status: 'stall', steps };
  return { status: 'error', name: 'Crash', message: `case process exited with ${exitCode}`, steps };
}

// The regex patterns under V8 too (Chrome, where the stalls were seen), with Node.
async function runRegexV8() {
  const problems: string[] = [];
  let current = '';
  const { timedOut } = await runJsonLines(['node', '--experimental-strip-types', `${import.meta.dir}/regex-v8.ts`], (data) => {
    if (data.type === 'start') current = `${data.name} / ${data.pattern}`;
    if (data.type === 'done') {
      for (const [pattern, ms] of Object.entries(data.times as Record<string, number>)) {
        if (ms > stepBudgetMs) problems.push(`SLOW ${data.name} / ${pattern}: ${ms} ms`);
      }
    }
  });
  if (timedOut) problems.push(`STALL in ${current} (no result after ${timeoutMs} ms)`);
  console.log(`${problems.length ? 'FAIL' : 'ok  '} regex patterns under V8`);
  for (const problem of problems) console.log(`     ${problem}`);
  return problems.length;
}

// Step durations, from each step's start to the next one's.
const durations = (steps: [string, number][]) =>
  steps.slice(0, -1).map(([step, at], i) => [step, Math.round(steps[i + 1][1] - at)] as const);

console.log(`model ${model}, timeout ${timeoutMs} ms, post-NER step budget ${stepBudgetMs} ms\n`);
let failures = await runRegexV8();

for (const testCase of cases) {
  const text = joinPagesForNer(testCase.pages);
  // What the app reads offsets against: the NER input split back per page.
  const pageTexts = text.split(CUSTOM_PAGE_SPLIT_TOKEN);
  const outcome = await runCase(text);
  const problems: string[] = [];
  const warnings: string[] = [];
  const timing = durations(outcome.steps);

  if (outcome.status === 'stall') {
    problems.push(`STALL in step "${outcome.steps.at(-1)?.[0] ?? 'start'}" (no result after ${timeoutMs} ms)`);
  } else if (outcome.status === 'error') {
    problems.push(`ERROR in step "${outcome.steps.at(-1)?.[0]}": ${outcome.message}`);
    const frame = outcome.stack?.split('\n').find((line) => line.includes('token-classification-model'));
    if (frame) problems.push(`  at ${frame.trim()}`);
  } else {
    for (const [step, ms] of timing) {
      if (step !== 'classify' && ms > stepBudgetMs) problems.push(`SLOW step "${step}": ${ms} ms`);
    }
    const labeled = outcome.entities.filter((e) => e.type !== 'O');
    const misplaced = labeled.filter((e) => pageTexts[e.page - 1]?.slice(e.start, e.end) !== e.text);
    if (misplaced.length > 0) {
      const sample = misplaced.slice(0, 3).map((e) => `"${e.text}" p${e.page}@${e.start} reads "${pageTexts[e.page - 1]?.slice(e.start, e.end)}"`);
      problems.push(`OFFSETS ${misplaced.length} of ${labeled.length} entities do not match the page text: ${sample.join('; ')}`);
    }
    for (const expected of testCase.expect ?? []) {
      if (labeled.some((e) => e.text === expected)) continue;
      // The model can extend an entity over the next words: the text is then only redacted where
      // that whole phrase appears. Reported, not failed: a model quality issue, not a broken step.
      const wider = labeled.find((e) => e.text.includes(expected));
      if (wider) warnings.push(`WIDER "${expected}" only found inside ${wider.type} "${wider.text}"`);
      else problems.push(`MISSED "${expected}"`);
    }
  }

  const summary = outcome.status === 'result' ? `${outcome.entities.filter((e) => e.type !== 'O').length} entities` : outcome.status;
  const stepsLine = timing.map(([step, ms]) => `${step} ${ms}`).join(', ');
  console.log(`${problems.length ? 'FAIL' : 'ok  '} ${testCase.name} (${testCase.pages.length} p, ${text.length} chars): ${summary}${stepsLine ? ` [${stepsLine} ms]` : ''}`);
  for (const line of [...problems, ...warnings]) console.log(`     ${line}`);
  if (problems.length) failures++;
}

console.log(failures ? `\n${failures} check(s) failed` : '\nall checks passed');
process.exit(failures ? 1 : 0);
