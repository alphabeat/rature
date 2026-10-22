export const SITE_URL = 'https://rature.fr';

// Pages that are prerendered and indexed, in French at their path and in English under `/en`.
// App pages (processing, document, settings) are not listed: they stay unprefixed.
export const PUBLIC_PATHS = ['/', '/about', '/privacy-policy', '/legal-notice'] as const;

// Guides, French path to English path: their English slugs are translated.
export const GUIDE_PATHS = {
  '/guides': '/en/guides',
  '/guides/anonymiser-pdf-avant-chatgpt': '/en/guides/anonymize-pdf-before-chatgpt',
  '/guides/verifier-caviardage-pdf': '/en/guides/check-pdf-redaction',
  '/guides/anonymisation-vs-pseudonymisation': '/en/guides/anonymization-vs-pseudonymization',
} as const;

// Published and last updated, for every guide (pages, JSON-LD and sitemap).
export const GUIDES_DATE = '2026-10-21';

export type TranslatedPath = (typeof PUBLIC_PATHS)[number];
export type GuidePath = keyof typeof GUIDE_PATHS;
export type PublicPath = TranslatedPath | GuidePath;
export type Lang = 'fr' | 'en';

export function isGuidePath(path: string): path is GuidePath {
  return Object.hasOwn(GUIDE_PATHS, path);
}

export function localizedPath(path: string, lang: Lang): string {
  if (lang === 'fr') return path;
  if (isGuidePath(path)) return GUIDE_PATHS[path];
  if (!(PUBLIC_PATHS as readonly string[]).includes(path)) return path;
  return path === '/' ? '/en' : `/en${path}`;
}

const ALL_PATHS: PublicPath[] = [...PUBLIC_PATHS, ...(Object.keys(GUIDE_PATHS) as GuidePath[])];

// The public page a URL points to, or null for app pages and unknown URLs.
export function publicPage(pathname: string): { path: PublicPath; lang: Lang } | null {
  const trimmed = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  const lang: Lang = trimmed === '/en' || trimmed.startsWith('/en/') ? 'en' : 'fr';
  const path = ALL_PATHS.find((p) => localizedPath(p, lang) === trimmed);
  return path ? { path, lang } : null;
}

export const PRERENDER_PATHS = ALL_PATHS.flatMap((path) => [path, localizedPath(path, 'en')]);
