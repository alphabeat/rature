import { Figure, P, Stats, Steps, Table, Ul } from '@/components/guides/GuideBlocks.tsx';
import { GuideCta } from '@/components/guides/GuideCta.tsx';
import type { Guide, GuideStep } from '@/guides/types.ts';

const steps: GuideStep[] = [
  {
    title: 'Open the PDF in Rature.',
    text: 'Drop the file on the [home page](/en). It is read in your browser and sent nowhere. On first use, the detection model (about 400 MB) is downloaded once, then kept in cache.',
  },
  {
    title: 'Let detection find the data.',
    text: 'An AI model spots names, companies, addresses, emails, phone numbers, IBANs and other identifiers. Each detection is highlighted in the document.',
  },
  {
    title: 'Review and correct.',
    text: 'Remove what should not be hidden, add what is missing: a job title, a date, a case reference. When you select a name, every occurrence of it in the document is removed.',
  },
  {
    title: 'Handle the images.',
    text: 'In image editing, hide logos, signatures and stamps. A logo that appears on every page is handled in one go.',
  },
  {
    title: 'Export, then check.',
    text: 'The export replaces each piece of data with a "[REDACTED]" block, removes the text from the file and strips the metadata. Then copy and paste all the text: nothing hidden should reappear ([see the 5 tests](/en/guides/check-pdf-redaction)).',
  },
];

export const anonymizePdfBeforeChatgpt: Guide = {
  path: '/guides/anonymiser-pdf-avant-chatgpt',
  title: 'Anonymize a PDF before ChatGPT in 5 steps | Rature',
  description: 'Remove names, addresses and IBANs from a PDF before giving it to ChatGPT, without uploading it to a server. 5 tested steps, with French bar and CNIL rules.',
  ogTitle: 'Anonymize a PDF before giving it to ChatGPT',
  heading: 'How to anonymize a PDF before giving it to ChatGPT',
  breadcrumb: 'Anonymize a PDF before ChatGPT',
  readingTime: 6,
  card: {
    title: 'Anonymize a PDF before giving it to ChatGPT',
    line: 'The 5-step method, and what ChatGPT still sees afterwards.',
  },
  summary: (
    <>
      <P>
        To anonymize a PDF before giving it to ChatGPT, remove the names, addresses, numbers and identifiers from the file itself, check that no text remains under the hidden areas, then send the exported version. A black box drawn in Word is not enough: in our test, ChatGPT read all 17 pieces of data hidden that way.
      </P>
      <P>
        [Rature](/en) does these steps in your browser, free and without sign-up: the PDF is not sent to any server.
      </P>
    </>
  ),
  sections: [
    {
      id: 'why-anonymize',
      title: 'Why anonymize a document before sending it to ChatGPT?',
      content: (
        <>
          <P>
            When you attach a PDF to ChatGPT, all of its text goes to OpenAI's servers. On personal plans (Free, Go, Plus, Pro), your conversations can be used to train the models as long as the "Improve the model for everyone" setting stays on ([OpenAI help](https://help.openai.com/en/articles/7730893-data-controls-faq)). Turning the setting off does not change the upload: the file still leaves your computer, and even a temporary chat can be kept for up to 30 days.
          </P>
          <P>Regulated professions have stricter rules:</P>
          <Ul
            items={[
              '**Lawyers.** The French national bar council (CNB) practical guide on generative AI (September 2024) sets a clear rule: a lawyer "must never communicate data covered by professional secrecy to generative artificial intelligence". It lists the name, address, phone number, financial information and "any specific detail of a case that could identify a person or a company" (our translation).',
              '**Companies and public bodies.** The CNIL, the French data protection authority, recommends governing the use of generative AI with a policy that, depending on the case, forbids sharing confidential or personal data, especially when the provider can reuse it ([CNIL FAQ of 18 July 2024](https://www.cnil.fr/fr/les-questions-reponses-de-la-cnil-sur-lutilisation-dun-systeme-dia-generative), in French).',
              '**Everyone.** The GDPR requires data minimization: only share the data the task needs. To summarize a contract or rephrase a letter, ChatGPT needs neither the names nor the IBAN.',
            ]}
          />
        </>
      ),
    },
    {
      id: 'what-to-remove',
      title: 'What should you remove from the document?',
      content: (
        <>
          <Table
            head={['Data type', 'Examples', 'Detected automatically by Rature']}
            rows={[
              ['Identity', 'First and last names, companies, organizations', 'Yes'],
              ['Contact details', 'Addresses, postcodes, cities, emails, phone numbers', 'Yes'],
              ['Identifiers', 'IBANs, social security, case, registration and land registry numbers', 'Yes'],
              ['Dates and amounts', 'Dates of birth, exact dates, amounts', 'Yes, to check depending on context'],
              ['Images', 'Logos, signatures, stamps, photos', 'To select in image editing'],
              ['Indirect context', 'A unique role ("the only head of legal"), a project name, a precise place', 'No: that is your call during review'],
              ['File metadata', 'Author, title, software, creation dates', 'Yes, stripped on export'],
            ]}
          />
          <P>
            Indirect context is the most common trap. The CNB points it out too: even pseudonymized data can identify a client when cross-checked, for example an amount, an internal project name or the way a contract is drafted.
          </P>
        </>
      ),
    },
    {
      id: 'step-by-step',
      title: 'How to anonymize a PDF before ChatGPT, step by step',
      content: (
        <>
          <Steps steps={steps} />
          <P>
            You can then give the exported file to ChatGPT. Say in your prompt that "[REDACTED]" replaces data removed on purpose: the assistant will not try to guess it.
          </P>
          <GuideCta />
        </>
      ),
    },
    {
      id: 'what-chatgpt-sees',
      title: 'What ChatGPT sees after anonymization',
      content: (
        <>
          <P>
            We gave ChatGPT (free plan, default model) the same fictitious contract in two forms, with the same request: list every person, company, address, registration number and contact detail.
          </P>
          <Stats
            items={[
              { value: '17 of 17', text: 'pieces of data read by ChatGPT under a fake Word redaction (black highlighting and boxes).' },
              { value: '0 of 17', text: 'pieces of data found in the Rature export.' },
            ]}
          />
          <P>
            On the Rature export, ChatGPT concludes that "the missing data cannot be reconstructed from this document alone" (translated from French). Yet it understood the essentials: the purpose of the contract, the 30-day payment term, the confidentiality clause and the role of each party. The document stays useful for analysis without identifying anyone.
          </P>
          <Figure
            name="chatgpt-apres-rature"
            alt="ChatGPT's answer on the contract anonymized by Rature: four unnamed people and two unidentified companies."
            caption="ChatGPT on the Rature export: the roles remain, the names and companies are gone. Test of 12 October 2026, in French."
          />
          <P>
            Full method, files and ChatGPT conversations: [how to check that a PDF is really redacted](/en/guides/check-pdf-redaction).
          </P>
        </>
      ),
    },
    {
      id: 'anonymization-or-pseudonymization',
      title: 'Anonymization or pseudonymization: what does Rature do?',
      content: (
        <>
          <P>
            Rature redacts: each selected piece of data is removed from the file and replaced with a black block. It is not pseudonymization, which would replace "Camille Dufresne" with a consistent alias such as "Person A". Replacement with pseudonyms is in the works in Rature.
          </P>
          <P>
            What it changes in practice: ChatGPT cannot tell two hidden people apart. For most documents, the roles are enough ("the Client", "the Provider", "the President"). The CNB recommends pseudonymization for this need.
          </P>
          <P>
            Mind the vocabulary: a redacted document is only anonymous, in the CNIL's sense, if no one can be identified anymore, even indirectly. [Anonymization or pseudonymization: what is the difference?](/en/guides/anonymization-vs-pseudonymization)
          </P>
        </>
      ),
    },
    {
      id: 'limits',
      title: 'Limits to know',
      content: (
        <Ul
          items={[
            '**Scanned PDFs.** Rature reads the text of the PDF. A scan without a text layer is not analyzed automatically.',
            '**Word files.** Save the document as a PDF first, then anonymize the PDF.',
            '**Automatic detection.** It can miss a piece of data or hide one too many. Reviewing before export is essential.',
            '**Titles.** "Ms" and "Mr" are kept by default: they reveal gender. Add them to the selection if needed.',
          ]}
        />
      ),
    },
  ],
  faq: [
    {
      q: 'Is turning off training in ChatGPT enough?',
      a: 'No. The "Improve the model for everyone" setting stops your new conversations from being used for training, but the file is still sent to and kept by OpenAI. For a confidential document, the only protection is not to send the data.',
    },
    {
      q: 'Can I ask ChatGPT to ignore the names?',
      a: 'No. Once the file is sent, ChatGPT has already received the names. They have to be removed before sending.',
    },
    {
      q: 'Does ChatGPT Enterprise or Business change anything?',
      a: 'By default, OpenAI does not train its models on data from these plans. The documents are still sent to and stored by the provider: check the contract and the rules of your profession.',
    },
    {
      q: 'Does the method apply to Copilot, Gemini, Claude or Mistral\'s Le Chat?',
      a: 'Yes. All these assistants receive the content of the file you give them. Anonymize the PDF before sending it, whatever the tool.',
    },
    {
      q: 'Is Rature free?',
      a: 'Yes, with no sign-up and no usage limit. The code is open source under the AGPL license, and processing happens in your browser.',
    },
    {
      q: 'Can the hidden text be recovered from the export?',
      a: 'No. Rature removes the text from the file, it does not draw a box over it. Copy and paste or an extraction tool finds nothing under the hidden areas.',
    },
  ],
  howTo: { name: 'How to anonymize a PDF before giving it to ChatGPT', steps },
  sources: [
    'Conseil national des barreaux (French national bar council), [Guide pratique : utilisation des systèmes d\'intelligence artificielle générative](https://cnb.avocat.fr/medias/cnb-guidepratique-utilisation-systemes-iag-2024-68f7b1d86e4570.98487114.pdf), 1st edition, September 2024 (in French).',
    'CNIL, [Les questions-réponses de la CNIL sur l\'utilisation d\'un système d\'IA générative](https://www.cnil.fr/fr/les-questions-reponses-de-la-cnil-sur-lutilisation-dun-systeme-dia-generative), 18 July 2024 (in French).',
    'CNIL, [L\'anonymisation de données personnelles](https://www.cnil.fr/fr/technologies/lanonymisation-de-donnees-personnelles), 19 May 2020 (in French).',
    'OpenAI, [Data Controls FAQ](https://help.openai.com/en/articles/7730893-data-controls-faq), accessed 21 October 2026.',
    'Rature, [fake redaction test with ChatGPT](/en/guides/check-pdf-redaction), 12 and 13 October 2026.',
  ],
  related: ['/guides/verifier-caviardage-pdf', '/guides/anonymisation-vs-pseudonymisation'],
};
