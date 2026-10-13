// Builds the hand-curated entities of the sample document (`public/samples/contrat-exemple.pdf`).
// The sample shows the ideal result, so entities are listed here instead of coming from the model.
// The PDF is printed from `scripts/sample/contrat.html` (fictional logo: `logo.png`, from `logo.html`):
//   chrome --headless --no-pdf-header-footer --virtual-time-budget=5000 \
//     --print-to-pdf=public/samples/contrat-exemple.pdf scripts/sample/contrat.html
// Then run `bun run sample:entities`.
import { writeFileSync } from 'node:fs';

import { extractTextFromPDF } from '../src/lib/pdf/processPDF.ts';
import { NER_MODELS } from '../src/models/utils.ts';
import type { GroupedEntity } from '../src/types/index.ts';

const PDF = 'public/samples/contrat-exemple.pdf';
const OUT = 'src/lib/sample/contrat-exemple.json';
const MODEL = 'camembertNerPii';

// Every occurrence of each value (case-sensitive, whole words) becomes an entity.
const VALUES: [type: string, text: string][] = [
  ['NOM_SOCIETE', 'Belvane Conseil SAS'],
  ['NOM_SOCIETE', 'Atelier Verrier SARL'],
  ['PRENOM_PERSONNE', 'Camille'],
  ['NOM_PERSONNE', 'Dufresne'],
  ['PRENOM_PERSONNE', 'Marc-Antoine'],
  ['NOM_PERSONNE', 'Lefèvre'],
  ['PRENOM_PERSONNE', 'Sophie'],
  ['NOM_PERSONNE', 'Garnier'],
  ['NOM_VOIE', '14 rue des Tanneurs'],
  ['NOM_VOIE', '8 allée des Chartrons'],
  ['CODE_POSTAL', '69002'],
  ['CODE_POSTAL', '33000'],
  ['VILLE', 'Lyon'],
  ['VILLE', 'Bordeaux'],
  ['ID', '812 345 678'],
  ['ID', '903 112 457'],
  ['IBAN', 'FR76 3000 6000 0112 3456 7890 189'],
  ['TELEPHONE', '06 12 34 56 78'],
  ['TELEPHONE', '05 56 48 21 90'],
  ['EMAIL', 'sophie.garnier@belvane-conseil.fr'],
  ['AMOUNT', '20 000'],
  ['AMOUNT', '18 500'],
  ['DATE', '1er octobre 2026'],
  ['DATE', '3 septembre 2026'],
];

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const result = await extractTextFromPDF(await Bun.file(PDF).arrayBuffer());
if (!result.success) throw new Error(`Cannot read ${PDF}`);

const entities: GroupedEntity[] = [];
for (const { pageNumber, text } of result.pages) {
  const found: GroupedEntity[] = [];
  for (const [type, value] of VALUES) {
    if (!NER_MODELS[MODEL].entities[type]) throw new Error(`Unknown type ${type}`);
    for (const match of text.matchAll(new RegExp(`(?<![\\p{L}\\p{N}])${escape(value)}(?![\\p{L}\\p{N}])`, 'gu'))) {
      const start = match.index;
      const end = start + value.length;
      // Earlier values in the list win over overlapping later ones.
      if (found.some((e) => start < e.end && end > e.start)) continue;
      found.push({ id: '', type, text: value, score: 1, page: pageNumber, start, end, included: true });
    }
  }
  entities.push(...found.sort((a, b) => a.start - b.start));
}

for (const [type, value] of VALUES) {
  if (!entities.some((e) => e.type === type && e.text === value)) throw new Error(`Not found: ${value}`);
}

entities.forEach((e, i) => { e.id = `sample-${i + 1}`; });

const modelTokens = Object.keys(NER_MODELS[MODEL].entities).filter((t) => t !== 'MANUAL');
writeFileSync(OUT, `${JSON.stringify({ modelName: MODEL, modelTokens, entities }, null, 2)}\n`);
console.log(`${entities.length} entities on ${result.pageCount} pages, ${result.detectedImages.length} images -> ${OUT}`);
