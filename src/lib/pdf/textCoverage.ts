import type { TextExtract } from '@/context/pdfProcessing.tsx';

// A page with less extracted text than this has no usable text layer (scanned image).
const MIN_PAGE_TEXT_LENGTH = 15;

/** How much of the document has a text layer: `none` is a scan, `partial` a mix. */
export type TextCoverage = 'none' | 'partial' | 'full';

export function isScannedPage(text: string): boolean {
  return text.trim().length < MIN_PAGE_TEXT_LENGTH;
}

export function textCoverage(extracts: TextExtract[]): TextCoverage {
  const scanned = extracts.filter((extract) => isScannedPage(extract.text)).length;
  if (scanned === 0) return 'full';
  return scanned === extracts.length ? 'none' : 'partial';
}
