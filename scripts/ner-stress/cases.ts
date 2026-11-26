// Tricky page texts for the post-NER stress run (`run.ts`). Each case is a list of pages, as
// `extractTextFromPDF` returns them (one string per page, lines joined with '\n').
// `expect` lists texts that must come out as entities (the model keeps one entity per unique
// text): regex entities (emails, URLs, dates) so the check does not depend on the model.

export interface StressCase {
  name: string;
  pages: string[];
  expect?: string[];
}

const CLAUSE = 'Le présent contrat est conclu entre la société Belvane Conseil SAS, représentée par Camille Dufresne, et Monsieur Marc-Antoine Lefèvre, demeurant 14 rue des Tanneurs à Lyon.';
const paragraph = (n: number) => Array.from({ length: n }, () => CLAUSE).join('\n');
const dots = (n: number) => '.'.repeat(n);

export const CASES: StressCase[] = [
  {
    name: 'form-leaders',
    // Blank-to-fill lines stuck to the next label, as text extraction often returns them.
    pages: [
      `FORMULAIRE DE DEMANDE\nNom${dots(40)}Prénom${dots(40)}\nAdresse${dots(60)}Ville${dots(30)}\nCourriel : jean.martin@exemple.fr\n${paragraph(3)}`,
    ],
    expect: ['jean.martin@exemple.fr'],
  },
  {
    name: 'toc-leaders',
    pages: [
      `SOMMAIRE\nArticle 1 Objet${dots(50)}3\nArticle 2 Durée${dots(50)}Page 4\nAnnexe A${dots(80)}Annexe B${dots(80)}\n${paragraph(2)}`,
    ],
  },
  {
    name: 'rules-and-separators',
    pages: [
      `${'-'.repeat(120)}\nTotal${'-'.repeat(60)}TTC\n${'_'.repeat(80)}\n${'='.repeat(80)}\nVoir www.service-public.fr${'/'.repeat(30)}\n${'•'.repeat(50)}\n${paragraph(2)}`,
    ],
    expect: [`www.service-public.fr${'/'.repeat(30)}`],
  },
  {
    name: 'urls',
    pages: [
      [
        'Texte : https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006419292/2008-05-01/ consulté le 03/09/2026.',
        'Source (https://www.service-public.fr/particuliers/vosdroits/F1234?lang=fr), voir aussi impots.gouv.fr.',
        'Modèle : https://cabinet-avocat.fr/wp-content/uploads/2024/03/modele-contrat-bail-meuble.pdf, page 2.',
        'Écrire à contact@belvane-conseil.fr ou sur belvane-conseil.fr/contact.',
      ].join('\n'),
    ],
    expect: [
      'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006419292/2008-05-01/',
      'https://www.service-public.fr/particuliers/vosdroits/F1234?lang=fr',
      'contact@belvane-conseil.fr',
    ],
  },
  {
    name: 'table',
    pages: [
      [
        'Date Libellé Débit Crédit Solde',
        ...Array.from({ length: 60 }, (_, i) => `${String((i % 28) + 1).padStart(2, '0')}/10/2026 VIR SEPA M. DUPONT JEAN REF ${100000 + i} ${(i * 13.37).toFixed(2)} 0,00 ${(5000 - i * 13.37).toFixed(2)}`),
        'IBAN FR76 3000 6000 0112 3456 7890 189 BIC AGRIFRPP',
      ].join('\n'),
    ],
  },
  {
    name: 'long-line',
    // One page with no line break at all, as some generators produce.
    pages: [Array.from({ length: 150 }, () => CLAUSE).join(' ')],
  },
  {
    name: 'no-space-blob',
    pages: [`Signature électronique : ${'QmFzZTY0U2lnbmF0dXJl'.repeat(150)}==\n${paragraph(2)}`],
  },
  {
    name: 'unicode',
    pages: [
      [
        'Montant : 12 500 € réglé par M. Lefèvre le 1er octobre 2026.',
        'Ligatures : le bénéﬁciaire ﬂorent@exemple.fr, ﬀ ﬃ.',
        'Zéro largeur : Ca​mille Du‍fresne, trait­d’union, café (é).',
        'Points de suspension… puis « guillemets » et — tirets – divers… sophie@exemple.fr',
        'Emoji 📄✅ 👩🏽‍⚖️, arabe مرحبا بكم, chinois 合同, grec Σύμβαση.',
      ].join('\n'),
    ],
    expect: ['sophie@exemple.fr'],
  },
  {
    name: 'entity-across-page-break',
    pages: [
      `${paragraph(2)}\nFait à Lyon, le 3 septembre 2026, par Camille`,
      `Dufresne, gérante. Contact : camille.dufresne@exemple.fr\n${paragraph(1)}`,
    ],
    expect: ['camille.dufresne@exemple.fr'],
  },
  {
    name: 'empty-pages',
    // Scanned or blank pages between text pages.
    pages: [
      `${paragraph(2)}\nContact : premier@exemple.fr`,
      '',
      '',
      `${paragraph(2)}\nContact : second@exemple.fr`,
      '',
    ],
    expect: [
      'premier@exemple.fr',
      'second@exemple.fr',
    ],
  },
  {
    name: 'regex-first-token-last',
    // The first token of a regex entity (the date) is also the very last token of the document.
    pages: [`${paragraph(1)}\nSigné le 12/03/2026.`, `${paragraph(1)}\nPage 12`],
  },
  {
    name: 'email-last-token',
    pages: [`${paragraph(1)}\nÉcrire à jean@exemple.fr ou à jean`],
    expect: ['jean@exemple.fr'],
  },
  {
    name: 'many-pages-repeated',
    // 60 pages, each repeating the same names, dates and emails: stresses expansion and deduplication.
    pages: Array.from({ length: 60 }, (_, i) => `Page ${i + 1}\n${paragraph(4)}\nLe 03/09/2026, le 1er octobre 2026 et le 12/12/2026, écrire à sophie.garnier@belvane-conseil.fr ou 06 12 34 56 78.`),
    expect: ['sophie.garnier@belvane-conseil.fr'],
  },
  {
    name: 'punctuation-only-pages',
    pages: ['....', '- - -', '12', `${paragraph(1)}\nmail : fin@exemple.fr`],
    expect: ['fin@exemple.fr'],
  },
];
