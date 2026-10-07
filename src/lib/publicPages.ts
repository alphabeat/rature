// Pages that are prerendered and indexed, in French at their path and in English under `/en`.
// App pages (processing, document, settings) are not listed: they stay unprefixed.
export const PUBLIC_PATHS = ['/', '/about', '/privacy-policy'] as const;

export type PublicPath = (typeof PUBLIC_PATHS)[number];
export type Lang = 'fr' | 'en';

export function localizedPath(path: string, lang: Lang): string {
  if (lang === 'fr' || !(PUBLIC_PATHS as readonly string[]).includes(path)) return path;
  return path === '/' ? '/en' : `/en${path}`;
}

// The public page a URL points to, or null for app pages and unknown URLs.
export function publicPage(pathname: string): { path: PublicPath; lang: Lang } | null {
  const trimmed = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  const lang: Lang = trimmed === '/en' || trimmed.startsWith('/en/') ? 'en' : 'fr';
  const path = lang === 'en' ? trimmed.slice(3) || '/' : trimmed;
  return (PUBLIC_PATHS as readonly string[]).includes(path) ? { path: path as PublicPath, lang } : null;
}

export const PRERENDER_PATHS = PUBLIC_PATHS.flatMap((path) => [path, localizedPath(path, 'en')]);
