export const SITE_URL = 'https://rature.fr';

// Pages that are prerendered and indexed, in French at their path and in English under `/en`.
// App pages (processing, document, settings) are not listed: they stay unprefixed.
export const PUBLIC_PATHS = ['/', '/about', '/privacy-policy'] as const;

// French-only pages: no `/en` counterpart, no language alternates.
export const GUIDE_PATHS = [
  '/guides',
  '/guides/anonymiser-pdf-avant-chatgpt',
  '/guides/verifier-caviardage-pdf',
  '/guides/anonymisation-vs-pseudonymisation',
] as const;

// Published and last updated, for every guide (pages, JSON-LD and sitemap).
export const GUIDES_DATE = '2026-10-21';

export type TranslatedPath = (typeof PUBLIC_PATHS)[number];
export type GuidePath = (typeof GUIDE_PATHS)[number];
export type PublicPath = TranslatedPath | GuidePath;
export type Lang = 'fr' | 'en';

export function localizedPath(path: string, lang: Lang): string {
  if (lang === 'fr' || !(PUBLIC_PATHS as readonly string[]).includes(path)) return path;
  return path === '/' ? '/en' : `/en${path}`;
}

export function isGuidePath(path: string): path is GuidePath {
  return (GUIDE_PATHS as readonly string[]).includes(path);
}

// The public page a URL points to, or null for app pages and unknown URLs.
export function publicPage(pathname: string): { path: PublicPath; lang: Lang } | null {
  const trimmed = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  const lang: Lang = trimmed === '/en' || trimmed.startsWith('/en/') ? 'en' : 'fr';
  const path = lang === 'en' ? trimmed.slice(3) || '/' : trimmed;
  if (isGuidePath(path)) return lang === 'fr' ? { path, lang } : null;
  return (PUBLIC_PATHS as readonly string[]).includes(path) ? { path: path as TranslatedPath, lang } : null;
}

export const PRERENDER_PATHS = [...PUBLIC_PATHS.flatMap((path) => [path, localizedPath(path, 'en')]), ...GUIDE_PATHS];
