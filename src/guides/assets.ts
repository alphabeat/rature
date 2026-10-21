export type FigureName =
  | 'chatgpt-apres-rature'
  | 'caviardage-word-apparence'
  | 'chatgpt-lit-faux-caviardage'
  | 'logo-sous-rectangle';

// Pixel size of each `public/guides/<name>.webp`, and an optional Tailwind max-width class.
export const FIGURES: Record<FigureName, { width: number; height: number; maxWidth?: string }> = {
  'chatgpt-apres-rature': { width: 715, height: 430 },
  'caviardage-word-apparence': { width: 760, height: 820, maxWidth: 'max-w-md' },
  'chatgpt-lit-faux-caviardage': { width: 745, height: 540 },
  'logo-sous-rectangle': { width: 600, height: 164, maxWidth: 'max-w-sm' },
};

export const TEST_PDF_PATH = '/guides/test-faux-caviardage.pdf';
