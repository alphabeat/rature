// Child process of `run.ts`: runs one case through the real model and the real
// `TokenClassificationModel.process()`, printing one JSON line per step, then the result.
// A separate process per case, so a stalled step can be killed without taking the run down.
import { pipeline } from '@huggingface/transformers';

import { BertBaseMerModel, CamembertNerPiiModel, DistilbertBaseMultiCasedNerModel, NERmembertLarge4Entities, NERmemberta4Entities } from '../../src/models/index.ts';
import type { TokenClassificationModel } from '../../src/models/token-classification-model.ts';
import type { NERModel } from '../../src/models/utils.ts';

const MODELS: Record<NERModel, () => TokenClassificationModel> = {
  bertBaseNer: () => new BertBaseMerModel(),
  camembertNerPii: () => new CamembertNerPiiModel(),
  distilbertBaseMultiCasedNer: () => new DistilbertBaseMultiCasedNerModel(),
  nermembertLarge4Entities: () => new NERmembertLarge4Entities(),
  nermemberta4Entities: () => new NERmemberta4Entities(),
};

const emit = (data: object) => process.stdout.write(`${JSON.stringify(data)}\n`);

const [modelName, inputPath] = process.argv.slice(2);
const text = await Bun.file(inputPath).text();
const model = MODELS[modelName as NERModel]();
// The app passes 'wasm'; under Bun the ONNX backend is the native CPU one.
model.classifier = await pipeline('token-classification', model.model, { dtype: 'fp32' });

try {
  const entities = await model.process(text, undefined, (step) => emit({ type: 'step', step, at: performance.now() }));
  emit({ type: 'step', step: 'done', at: performance.now() });
  emit({ type: 'result', entities });
} catch (err) {
  emit({ type: 'error', name: err instanceof Error ? err.name : typeof err, message: String(err), stack: err instanceof Error ? err.stack : undefined });
}
