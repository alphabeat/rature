import { anonymiserPdfAvantChatgpt } from '@/guides/anonymiser-pdf-avant-chatgpt.tsx';
import { anonymisationVsPseudonymisation } from '@/guides/anonymisation-vs-pseudonymisation.tsx';
import type { Guide } from '@/guides/types.ts';
import { verifierCaviardagePdf } from '@/guides/verifier-caviardage-pdf.tsx';
import type { GuidePath } from '@/lib/publicPages.ts';

// Published and last updated, for every guide.
export const GUIDES_DATE = '2026-10-21';

export const GUIDES: Guide[] = [anonymiserPdfAvantChatgpt, verifierCaviardagePdf, anonymisationVsPseudonymisation];

export function guideByPath(path: string): Guide {
  const guide = GUIDES.find((g) => g.path === path);
  if (!guide) throw new Error(`Unknown guide: ${path}`);
  return guide;
}

export const HUB: {
  path: GuidePath;
  title: string;
  description: string;
  heading: string;
  intro: string;
} = {
  path: '/guides',
  title: 'Guides : anonymiser et caviarder un PDF sans l\'envoyer | Rature',
  description: 'Guides pratiques pour anonymiser un PDF avant ChatGPT, vérifier un caviardage et choisir entre anonymisation et pseudonymisation. Méthodes testées, sources CNIL et CNB.',
  heading: 'Guides : anonymiser un PDF, vérifier un caviardage',
  intro: 'Des méthodes testées sur de vrais fichiers, pour juristes, avocats, DPO et toute personne qui partage des documents confidentiels. Chaque guide cite ses sources et indique sa date de mise à jour.',
};
