import { anonymizationVsPseudonymization } from '@/guides/en/anonymization-vs-pseudonymization.tsx';
import { anonymizePdfBeforeChatgpt } from '@/guides/en/anonymize-pdf-before-chatgpt.tsx';
import { checkPdfRedaction } from '@/guides/en/check-pdf-redaction.tsx';
import { anonymisationVsPseudonymisation } from '@/guides/fr/anonymisation-vs-pseudonymisation.tsx';
import { anonymiserPdfAvantChatgpt } from '@/guides/fr/anonymiser-pdf-avant-chatgpt.tsx';
import { verifierCaviardagePdf } from '@/guides/fr/verifier-caviardage-pdf.tsx';
import type { Guide } from '@/guides/types.ts';
import { isGuidePath, publicPage, type Lang } from '@/lib/publicPages.ts';

export { GUIDES_DATE } from '@/lib/publicPages.ts';

// Same order in both languages; `path` is the French path in both (see `localizedPath`).
export const GUIDES: Record<Lang, Guide[]> = {
  fr: [anonymiserPdfAvantChatgpt, verifierCaviardagePdf, anonymisationVsPseudonymisation],
  en: [anonymizePdfBeforeChatgpt, checkPdfRedaction, anonymizationVsPseudonymization],
};

// The guide a URL points to, in the URL's language, or undefined.
export function findGuide(pathname: string): { guide: Guide; lang: Lang } | undefined {
  const page = publicPage(pathname);
  if (!page || !isGuidePath(page.path)) return undefined;
  const guide = GUIDES[page.lang].find((g) => g.path === page.path);
  return guide && { guide, lang: page.lang };
}

export function guideByPath(path: string, lang: Lang): Guide {
  const guide = GUIDES[lang].find((g) => g.path === path);
  if (!guide) throw new Error(`Unknown guide: ${path}`);
  return guide;
}

export const HUB: Record<Lang, {
  title: string;
  description: string;
  heading: string;
  intro: string;
}> = {
  fr: {
    title: 'Guides : anonymiser et caviarder un PDF sans l\'envoyer | Rature',
    description: 'Guides pratiques pour anonymiser un PDF avant ChatGPT, vérifier un caviardage et choisir entre anonymisation et pseudonymisation. Méthodes testées, sources CNIL et CNB.',
    heading: 'Guides : anonymiser un PDF, vérifier un caviardage',
    intro: 'Des méthodes testées sur de vrais fichiers, pour juristes, avocats, DPO et toute personne qui partage des documents confidentiels. Chaque guide cite ses sources et indique sa date de mise à jour.',
  },
  en: {
    title: 'Guides: anonymize and redact a PDF without uploading it | Rature',
    description: 'Practical guides to anonymize a PDF before ChatGPT, check a redaction and choose between anonymization and pseudonymization. Tested methods, cited sources.',
    heading: 'Guides: anonymize a PDF, check a redaction',
    intro: 'Methods tested on real files, for legal teams, lawyers, DPOs and anyone who shares confidential documents. Each guide cites its sources and shows when it was last updated.',
  },
};
