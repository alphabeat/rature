// Times the regex entity patterns under V8 (Chrome's engine; `run.ts` itself runs on Bun, which
// uses Safari's). Run with Node by `run.ts`: prints one JSON line per input, so a pattern that
// backtracks exponentially shows up as the last line before the timeout.
import { DATE_REGEX, EMAIL_REGEX, ID_REGEX, IP_ADDRESS_REGEX, URL_REGEX } from '../../src/lib/utils.ts';
import { CASES } from './cases.ts';

const PATTERNS = { DATE_REGEX, EMAIL_REGEX, ID_REGEX, IP_ADDRESS_REGEX, URL_REGEX };

// Runs of separators after domain- and email-like heads, the shapes that froze the old URL pattern.
const heads = ['http://site.fr', 'www.site.fr', 'contact@site.fr', 'Nom', 'Article 1', '12', 'a.b'];
const separators = ['.', '/', '-', ',', '_', ' .', '@', ':'];
const adversarial = heads.flatMap((head) => separators.map((sep) => `x ${head}${sep.repeat(200)}!Prénom${sep.repeat(200)}`));

const inputs = [
  ...CASES.map((c) => ({ name: c.name, text: c.pages.join(' ') })),
  { name: 'adversarial-separators', text: adversarial.join(' ') },
];

for (const { name, text } of inputs) {
  const times: Record<string, number> = {};
  for (const [pattern, regex] of Object.entries(PATTERNS)) {
    process.stdout.write(`${JSON.stringify({ type: 'start', name, pattern })}\n`);
    const start = performance.now();
    Array.from(text.matchAll(regex));
    times[pattern] = Math.round(performance.now() - start);
  }
  process.stdout.write(`${JSON.stringify({ type: 'done', name, times })}\n`);
}
