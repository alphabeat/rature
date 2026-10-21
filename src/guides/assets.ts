import caviardageWordApparence from '@/assets/guides/caviardage-word-apparence.webp';
import chatgptApresRature from '@/assets/guides/chatgpt-apres-rature.webp';
import chatgptLitFauxCaviardage from '@/assets/guides/chatgpt-lit-faux-caviardage.webp';
import logoSousRectangle from '@/assets/guides/logo-sous-rectangle.webp';

export type FigureName =
  | 'chatgpt-apres-rature'
  | 'caviardage-word-apparence'
  | 'chatgpt-lit-faux-caviardage'
  | 'logo-sous-rectangle';

// Imported so the URLs are hashed (nginx caches images as immutable), with pixel size and an
// optional Tailwind max-width class.
export const FIGURES: Record<FigureName, { src: string; width: number; height: number; maxWidth?: string }> = {
  'chatgpt-apres-rature': { src: chatgptApresRature, width: 715, height: 430 },
  'caviardage-word-apparence': { src: caviardageWordApparence, width: 760, height: 820, maxWidth: 'max-w-md' },
  'chatgpt-lit-faux-caviardage': { src: chatgptLitFauxCaviardage, width: 745, height: 540 },
  'logo-sous-rectangle': { src: logoSousRectangle, width: 600, height: 164, maxWidth: 'max-w-sm' },
};

export const TEST_PDF_PATH = '/guides/test-faux-caviardage.pdf';
