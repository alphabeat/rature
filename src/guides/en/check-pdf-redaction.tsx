import ogImage from '@/assets/guides/og-verifier-caviardage.png';
import { Callout, Figure, P, PdfDownload, Quote, Steps, Table, Ul } from '@/components/guides/GuideBlocks.tsx';
import { GuideCta } from '@/components/guides/GuideCta.tsx';
import type { Guide, GuideStep } from '@/guides/types.ts';

const steps: GuideStep[] = [
  {
    title: 'Copy and paste all the text.',
    text: 'Open the PDF, select all (Ctrl+A or Cmd+A), copy, then paste into a text editor (Notepad, TextEdit). If a hidden piece of data appears, the redaction is fake.',
  },
  {
    title: 'Search for a hidden word.',
    text: 'With Ctrl+F (Cmd+F), type a name or number you know was redacted. If it is found, it is still in the file.',
  },
  {
    title: 'Check the images.',
    text: 'A box placed over a logo, a signature or a scanned page leaves the whole image underneath. Try selecting or moving the image in a PDF editor. Watch out for OCR\'d scans too: they contain an invisible text layer.',
  },
  {
    title: 'Check the metadata and hidden elements.',
    text: 'In File > Properties, look at the title, author and keywords. Also check comments, layers, bookmarks and attachments.',
  },
  {
    title: 'Going further: the command line.',
    text: 'The free Poppler tools extract everything the file contains: `pdftotext` for the text, `pdfimages -list` for the images, `pdfinfo` for the metadata.',
  },
];

export const checkPdfRedaction: Guide = {
  path: '/guides/verifier-caviardage-pdf',
  title: 'Check a PDF redaction: 5 tests in 2 minutes | Rature',
  description: 'A black box does not remove the text. 5 tests to check a PDF redaction, and our test: ChatGPT read 17 of 17 pieces of data under a fake redaction.',
  ogTitle: 'Under a fake Word redaction, ChatGPT read 17 of 17 pieces of data',
  heading: 'How to check that a PDF is really redacted',
  ogImage: {
    src: ogImage,
    alt: 'Under a fake Word redaction, ChatGPT read 17 of 17 pieces of data. The Rature export: 0 of 17.',
  },
  breadcrumb: 'Check a PDF redaction',
  readingTime: 7,
  card: {
    title: 'Check that a PDF is really redacted',
    line: '5 tests in 2 minutes. Under a fake Word redaction, ChatGPT read 17 of 17 pieces of data.',
  },
  summary: (
    <>
      <P>
        To check a redaction, select all the text in the PDF (Ctrl+A, or Cmd+A on a Mac), copy it and paste it into a text editor: if a hidden name reappears, the redaction is fake. Follow up with a search (Ctrl+F) for a hidden word, then check the images, the metadata and the annotations.
      </P>
      <P>
        The problem is common: a black box or black highlighting hides the text on screen but leaves it in the file. In our test, ChatGPT found all 17 pieces of data in a contract "redacted" in Word.
      </P>
    </>
  ),
  sections: [
    {
      id: 'black-box',
      title: 'Why a black box does not hide the text',
      content: (
        <>
          <P>
            A PDF stacks several layers: text, images, drawn shapes. A black box added in Word, in a PDF reader or in Preview is one more shape, placed over the text. Black highlighting only changes the background color. Either way, the text stays in the file: copy and paste, a search or an AI assistant read it without difficulty.
          </P>
          <P>A real redaction removes the text from the file, then draws the black block in its place.</P>
          <P>Professionals make this mistake too:</P>
          <Ul
            items={[
              '**January 2019, Paul Manafort\'s lawyers.** A filing in US federal court contained hidden passages that a simple copy and paste made readable ([Atlanta Journal-Constitution](https://www.ajc.com/blog/jamie-dupree/manafort-legal-team-botches-redactions-reveals-campaign-contacts-with-russian/iyGwxLTb04zd3cnxzb4MOL/)).',
              '**December 2025, Epstein files.** In some documents released by the US Department of Justice, the text under the black boxes could be recovered the same way ([Mediaite](https://www.mediaite.com/media/news/doj-redactions-of-some-epstein-files-easily-revealed-with-copy-and-paste)).',
            ]}
          />
        </>
      ),
    },
    {
      id: 'our-test',
      title: 'Our test: a contract redacted in Word, read by ChatGPT',
      content: (
        <>
          <P>
            **Method.** A fictitious French service contract: 2 companies, 3 people, 2 addresses, 2 company registration (RCS) numbers, an IBAN, a phone number and an email, 17 pieces of data in all. We "redacted" it in Word the way people often do: black highlighting on the names, black boxes on the addresses, numbers and contact details. Then "Save As &gt; PDF". The same contract was anonymized with Rature, default settings. Both PDFs were given to ChatGPT (free plan, default model), in two new conversations, with the same request, in French:
          </P>
          <Quote>Here is a contract. List all the people, companies, addresses, registration numbers and contact details (phone, email, IBAN) that appear in it.</Quote>
          <Figure
            name="caviardage-word-apparence"
            alt="Contract exported to PDF from Word, with names, addresses and numbers covered by black boxes."
            caption="The fake Word redaction: on screen, everything looks hidden."
          />
          <P>**Results.**</P>
          <Table
            head={['', 'Fake Word redaction', 'Rature export']}
            rows={[
              ['Data readable by copy and paste', '17 of 17', '0 of 17'],
              ['Data quoted by ChatGPT', '17 of 17', '0 of 17'],
              ['Logo covered by a box (second test)', 'Recoverable at full resolution', 'Removed from the file'],
              ['File metadata', 'Software and OS version kept', 'Stripped'],
            ]}
          />
          <P>
            On the fake redaction, ChatGPT answers with "the exhaustive inventory of people, companies, addresses and contact details": the three names, the two companies, the addresses, the RCS numbers, the phone number, the email and the IBAN, with a button to copy the IBAN. Nothing in its answer shows that it noticed the black boxes ([full conversation](https://chatgpt.com/share/6accb905-a63c-83ed-98d7-64af315dcd52), in French).
          </P>
          <Figure
            name="chatgpt-lit-faux-caviardage"
            alt="ChatGPT lists the full names of the three people in the contract, even though they are blacked out in the PDF."
            caption="ChatGPT on the PDF redacted in Word: the hidden names appear in plain text."
          />
          <P>
            On the Rature export, ChatGPT finds none of the 17 pieces of data and concludes that "the missing data cannot be reconstructed from this document alone" ([full conversation](https://chatgpt.com/share/6accbbd1-d4cc-83ed-bb7e-cecf54875b41), in French). The only trace: the street number "8", on its own, which does not reveal the address.
          </P>
          <P>
            **The logo.** In a second test (13 October 2026, 2-page contract), the client's logo was covered by a black box in Word. The whole image remained in the PDF, and an extraction tool recovered it at full resolution.
          </P>
          <Figure
            name="logo-sous-rectangle"
            alt={'The "Belvane Conseil" logo extracted intact from the PDF, although it was covered by a black box.'}
            caption="The logo extracted from under the black box, at full resolution."
          />
          <PdfDownload>Download the test PDF (fictitious contract in French, 49 KB) and do the copy and paste yourself.</PdfDownload>
        </>
      ),
    },
    {
      id: 'five-tests',
      title: '5 tests to check a PDF redaction',
      content: (
        <>
          <Steps steps={steps} />
          <Callout>
            Never test a real document by sending it to an online tool or to ChatGPT: that is exactly the leak you are trying to avoid. The tests above run on your computer.
          </Callout>
        </>
      ),
    },
    {
      id: 'fake-redaction',
      title: 'What to do if the redaction is fake',
      content: (
        <>
          <Ul
            items={[
              '**The document has not been sent yet.** Start again from the original file and use a tool that removes the text: [Rature](/en), or the redaction tool in Acrobat Pro (redactions there are only final once applied). Then run the 5 tests again.',
              '**The document has already been sent.** If personal data is exposed, it may be a personal data breach under the GDPR. Tell your DPO: the supervisory authority must be notified within 72 hours when the breach poses a risk to the people concerned.',
            ]}
          />
          <GuideCta />
        </>
      ),
    },
    {
      id: 'how-rature-redacts',
      title: 'How Rature redacts a PDF',
      content: (
        <Ul
          items={[
            '**The text is removed, not covered.** Each selected piece of data is deleted from the page content, then replaced with a "[REDACTED]" block.',
            '**Images are handled.** Selected logos, signatures and stamps are hidden or removed from the file.',
            '**Metadata is stripped** on export: original title, author, software and dates.',
            '**Everything happens in your browser.** The PDF is not sent to any server, and the code is open source ([GitHub](https://github.com/alphabeat/rature)): anyone can check what it does.',
          ]}
        />
      ),
    },
  ],
  faq: [
    {
      q: 'Is black highlighting in Word a redaction?',
      a: 'No. It changes the color behind the text, which stays in the file and in the exported PDF. Copy and paste makes it reappear.',
    },
    {
      q: 'Does printing to PDF remove hidden text?',
      a: 'Usually not: printing to PDF keeps the text, and the boxes remain simple shapes on top. Only converting to an image removes the text, at the cost of a document that no longer works for search and accessibility.',
    },
    {
      q: 'Can a scanned PDF contain hidden text?',
      a: 'Yes, if it went through OCR: text recognition adds an invisible text layer under the image. A black box placed over the scan does not remove it.',
    },
    {
      q: 'Are Acrobat redaction marks reliable?',
      a: 'Only once applied. As long as the redaction is just a mark, the text is still in the file.',
    },
    {
      q: 'How do you prove a document is properly redacted?',
      a: 'Keep the test results: a copy and paste without hidden data, a search with no match, and empty image lists and metadata. With Rature, the code is public, so the method can be checked.',
    },
  ],
  howTo: { name: 'How to check that a PDF is really redacted', steps },
  sources: [
    'Rature, fake redaction test of 12 October 2026: ChatGPT conversations [on the Word PDF](https://chatgpt.com/share/6accb905-a63c-83ed-98d7-64af315dcd52) and [on the Rature export](https://chatgpt.com/share/6accbbd1-d4cc-83ed-bb7e-cecf54875b41) (in French).',
    'Jamie Dupree, [Manafort legal team botches redactions](https://www.ajc.com/blog/jamie-dupree/manafort-legal-team-botches-redactions-reveals-campaign-contacts-with-russian/iyGwxLTb04zd3cnxzb4MOL/), Atlanta Journal-Constitution, 8 January 2019.',
    'Mediaite, [DOJ Redactions of Some Epstein Files Easily Revealed With Copy and Paste](https://www.mediaite.com/media/news/doj-redactions-of-some-epstein-files-easily-revealed-with-copy-and-paste), December 2025.',
    'GDPR, [Article 33: notification of a personal data breach to the supervisory authority](https://eur-lex.europa.eu/eli/reg/2016/679/oj).',
    'Poppler, [pdftotext, pdfimages and pdfinfo tools](https://poppler.freedesktop.org/).',
  ],
  related: ['/guides/anonymiser-pdf-avant-chatgpt', '/guides/anonymisation-vs-pseudonymisation'],
};
