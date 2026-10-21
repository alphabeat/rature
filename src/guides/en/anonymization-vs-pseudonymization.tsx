import { Ol, P, Table, Ul } from '@/components/guides/GuideBlocks.tsx';
import { GuideCta } from '@/components/guides/GuideCta.tsx';
import type { Guide } from '@/guides/types.ts';

export const anonymizationVsPseudonymization: Guide = {
  path: '/guides/anonymisation-vs-pseudonymisation',
  title: 'Anonymization vs pseudonymization: the difference | Rature',
  description: 'Anonymization is irreversible and takes data out of the GDPR; pseudonymization is reversible and the data stays personal. Definitions and examples.',
  ogTitle: 'Anonymization or pseudonymization: the difference, with examples',
  heading: 'Anonymization or pseudonymization: what is the difference?',
  breadcrumb: 'Anonymization or pseudonymization',
  readingTime: 6,
  card: {
    title: 'Anonymization or pseudonymization: what is the difference?',
    line: 'Official definitions, examples on a contract, and what to choose before using an AI.',
  },
  summary: (
    <>
      <P>
        Anonymization makes identifying a person impossible, irreversibly: the data is no longer personal and the GDPR no longer applies. Pseudonymization replaces direct identifiers (first and last name) with an alias but remains reversible: the data stays personal and the GDPR applies.
      </P>
      <P>
        Redaction, which removes passages from a document, is one way to get there, not a guarantee: a redacted document is only anonymous if no one can be identified anymore, even indirectly.
      </P>
    </>
  ),
  sections: [
    {
      id: 'definitions',
      title: 'The definitions',
      content: (
        <Ul
          items={[
            '**Anonymization**: "a process that uses a set of techniques to make it impossible, in practice, to identify the person by any means whatsoever and in an irreversible way" (CNIL, the French data protection authority, our translation).',
            '**Pseudonymization**: processing that prevents data from being attributed to a person without additional information. In practice, directly identifying data (first and last name) is replaced with indirectly identifying data (alias, number). The CNIL notes that the identity can often be recovered using third-party data, and that the operation is reversible (GDPR, Article 4).',
          ]}
        />
      ),
    },
    {
      id: 'comparison-table',
      title: 'Comparison table',
      content: (
        <Table
          head={['', 'Anonymization', 'Pseudonymization']}
          rows={[
            ['Principle', 'No one can be identified anymore', 'Direct identifiers are replaced with aliases'],
            ['Reversible', 'No', 'Yes, with the mapping table'],
            ['Personal data under the GDPR', 'No', 'Yes'],
            ['The GDPR applies', 'No', 'Yes (it is a recommended security measure)'],
            ['Example', '"The client\'s legal representative"', '"Ms A, President of company X"'],
            ['Typical use', 'Open data, statistics, publication', 'Research, internal analysis, working with an AI'],
          ]}
        />
      ),
    },
    {
      id: 'contract-example',
      title: 'Example on a contract sentence',
      content: (
        <>
          <P>Original: "Ms Camille Dufresne, President of Lumen Conseil SAS, 14 rue des Tanneurs, 69002 Lyon"</P>
          <Ul
            items={[
              '**Pseudonymized**: "Ms A, President of company X, Lyon". The method suggested by the French national bar council (CNB): fictitious initials and a wider geographic area. With the table "A = Camille Dufresne", you get back to the original.',
              '**Redacted (Rature)**: "Ms [REDACTED], President of [REDACTED], [REDACTED]". Direct identifiers are removed from the file, with no mapping table.',
              '**Anonymized**: "The client\'s legal representative". You also need to remove what allows cross-checking: the precise role, the city, the date, the amount. Context decides.',
            ]}
          />
        </>
      ),
    },
    {
      id: 'three-criteria',
      title: 'The 3 criteria for successful anonymization',
      content: (
        <>
          <P>
            European data protection authorities use three criteria (Opinion 05/2014 of the Article 29 Working Party, adopted by the CNIL). Applied to a document:
          </P>
          <Ol
            items={[
              '**Singling out**: it must not be possible to isolate a person. If the contract mentions "the head of legal" of a 20-person company, she is singled out, even without her name.',
              '**Linkability**: it must not be possible to link the document to other sources about the same person. A company registration number or a registered office address can be found in public registers in two clicks.',
              '**Inference**: it must not be possible to deduce information about a person. "Ms" and "Mr" left in plain text reveal each signatory\'s gender.',
            ]}
          />
          <P>If any of these risks remains, the document is not anonymous: it is pseudonymized, and the GDPR still applies.</P>
        </>
      ),
    },
    {
      id: 'redaction',
      title: 'What about redaction?',
      content: (
        <>
          <P>
            Redacting a document means removing passages so they can no longer be read. It is a technique, not a legal status. Depending on what you remove, the result is pseudonymized or anonymized.
          </P>
          <P>
            A well-known example: for the open data release of French court decisions, the first and last names of individuals who are parties or third parties are redacted before publication (Article L. 111-13 of the French Code of Judicial Organization). Other identifying elements are only redacted if they endanger people's safety or privacy.
          </P>
          <P>
            A redaction is only useful if it really removes the text. A black box placed on top leaves the data readable: [how to check a PDF redaction](/en/guides/check-pdf-redaction).
          </P>
        </>
      ),
    },
    {
      id: 'court-of-justice-2025',
      title: 'What the EU Court of Justice ruled in 2025',
      content: (
        <>
          <P>
            In its EDPS v SRB judgment of 4 September 2025 (C-413/23 P), the Court of Justice clarified that the nature of pseudonymized data depends on who holds it. For the body that keeps the mapping table, it remains personal. For a recipient with no reasonable means of re-identifying the people, it may not be. The assessment is made case by case.
          </P>
          <P>
            The European Data Protection Board also adopted guidelines on pseudonymization (01/2025) in January 2025, which present it as a protective measure, not a way out of the GDPR.
          </P>
        </>
      ),
    },
    {
      id: 'what-to-choose-before-ai',
      title: 'What to choose before using an AI like ChatGPT?',
      content: (
        <>
          <Ul
            items={[
              '**For a lawyer**, the French national bar council recommends pseudonymization: replace client names with fictitious initials and addresses with a wider area. It points out that no data covered by professional secrecy should be shared with a generative AI.',
              '**If the AI needs to tell people apart** (who signed, who has to pay), pseudonymization keeps that information: "Person A" and "Person B".',
              '**If the roles are enough** (summarize, rephrase, find a clause), redaction removes more and leaves no table to protect.',
            ]}
          />
          <P>
            Either way, review the context: a job title, a date or an amount can be enough to identify someone. [Anonymize a PDF before giving it to ChatGPT](/en/guides/anonymize-pdf-before-chatgpt)
          </P>
          <GuideCta />
        </>
      ),
    },
    {
      id: 'glossary',
      title: 'Glossary',
      content: (
        <Ul
          items={[
            '**Personal data**: any information relating to an identified or identifiable natural person, directly or indirectly.',
            '**Directly identifying data**: name, first name, photo, social security number.',
            '**Indirectly identifying data**: job title, address, date of birth, case number, which identify a person once combined.',
            '**Anonymization**: irreversible processing that makes identification impossible in practice.',
            '**Pseudonymization**: replacing direct identifiers with aliases, reversible with additional information.',
            '**Mapping table**: the list that links each alias to the real person. To be kept separately and protected.',
            '**Redaction**: removing passages from a document so they can no longer be read.',
            '**Fake redaction**: visual masking (black box or highlighting) that leaves the text in the file.',
            '**Re-identification**: recovering a person\'s identity from data that was supposed to hide it.',
            '**Data minimization**: the GDPR principle that only the data necessary for the purpose is processed.',
          ]}
        />
      ),
    },
  ],
  faq: [
    {
      q: 'Is pseudonymized data subject to the GDPR?',
      a: 'Yes, for the body that can re-identify the people. The CNIL considers it personal data. The EU Court of Justice accepts that it may not be for a recipient with no reasonable means of re-identification.',
    },
    {
      q: 'Is a redacted document anonymous?',
      a: 'Not necessarily. It is only anonymous if no one can be identified anymore, including through context (job title, place, date) or by cross-checking with other sources.',
    },
    {
      q: 'Does the GDPR require anonymization?',
      a: 'No, there is no general obligation to anonymize. It is a way to reuse or keep data beyond its retention period.',
    },
    {
      q: 'Are masking and anonymizing the same thing?',
      a: 'No. Masking hides information on screen. If the text stays in the file, nothing is anonymized.',
    },
    {
      q: 'Does Rature do pseudonymization?',
      a: 'Not yet. Rature removes the data and replaces it with a "[REDACTED]" block. Replacement with consistent pseudonyms is in the works.',
    },
  ],
  sources: [
    'CNIL, [L\'anonymisation de données personnelles](https://www.cnil.fr/fr/technologies/lanonymisation-de-donnees-personnelles), 19 May 2020 (in French).',
    'GDPR, [Article 4 (definitions) and Recital 26](https://eur-lex.europa.eu/eli/reg/2016/679/oj).',
    'Article 29 Working Party, [Opinion 05/2014 on Anonymisation Techniques](https://ec.europa.eu/justice/article-29/documentation/opinion-recommendation/files/2014/wp216_en.pdf), 10 April 2014.',
    'Conseil national des barreaux (French national bar council), [Guide pratique : utilisation des systèmes d\'intelligence artificielle générative](https://cnb.avocat.fr/medias/cnb-guidepratique-utilisation-systemes-iag-2024-68f7b1d86e4570.98487114.pdf), September 2024 (in French).',
    'Court of Justice of the EU, [Case C-413/23 P, EDPS v SRB](https://curia.europa.eu/juris/liste.jsf?num=C-413/23), 4 September 2025.',
    'EDPB, [Guidelines 01/2025 on pseudonymisation](https://www.edpb.europa.eu/our-work-tools/documents/public-consultations/2025/guidelines-012025-pseudonymisation_en), January 2025.',
    '[French Code of Judicial Organization](https://www.legifrance.gouv.fr/codes/texte_lc/LEGITEXT000006071164), Article L. 111-13 (from the law of 23 March 2019, in French).',
  ],
  related: ['/guides/anonymiser-pdf-avant-chatgpt', '/guides/verifier-caviardage-pdf'],
};
