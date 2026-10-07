import type { MetaDescriptor } from 'react-router';

export const SITE_URL = 'https://rature.fr';

const OG_IMAGE = `${SITE_URL}/og-image.png`;

type PageMeta = {
  path: string;
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  jsonLd?: Record<string, unknown>;
};

export function pageMeta({ path, title, description, ogTitle = title, ogDescription = description, jsonLd }: PageMeta): MetaDescriptor[] {
  const url = `${SITE_URL}${path}`;

  return [
    { title },
    { name: 'description', content: description },
    { tagName: 'link', rel: 'canonical', href: url },
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: ogTitle },
    { property: 'og:description', content: ogDescription },
    { property: 'og:url', content: url },
    { property: 'og:locale', content: 'fr_FR' },
    { property: 'og:site_name', content: 'Rature' },
    { property: 'og:image', content: OG_IMAGE },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:image:alt', content: 'Rature : anonymisez vos PDF, sans serveur, confidentialité totale.' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: ogTitle },
    { name: 'twitter:description', content: ogDescription },
    { name: 'twitter:image', content: OG_IMAGE },
    ...(jsonLd ? [{ 'script:ld+json': jsonLd }] : []),
  ];
}

// App routes hold an in-memory document: nothing to index there.
export const appMeta: MetaDescriptor[] = [
  { title: 'Rature' },
  { name: 'robots', content: 'noindex' },
];
