import type { NERModel } from '@/models/utils.ts';
import type { GroupedEntity } from '@/types/index.ts';

import analysis from '@/lib/sample/contrat-exemple.json' with { type: 'json' };

// Fictional 2-page contract with a logo. Its entities are hand-curated by `bun run sample:entities`
// (scripts/sample-entities.ts): rerun it whenever the PDF changes.
const SAMPLE_URL = '/samples/contrat-exemple.pdf';
const SAMPLE_NAME = 'contrat-exemple.pdf';

export type SampleAnalysis = {
  modelName: NERModel;
  modelTokens: string[];
  entities: GroupedEntity[];
};

export async function fetchSample(): Promise<{ file: File } & SampleAnalysis> {
  const response = await fetch(SAMPLE_URL);
  if (!response.ok) throw new Error(`Sample download failed: ${response.status}`);

  const file = new File([await response.blob()], SAMPLE_NAME, { type: 'application/pdf' });

  return { file, ...(analysis as SampleAnalysis) };
}
