import { AUTHOR_GITHUB_URL, AUTHOR_LINKEDIN_URL, AUTHOR_NAME, AUTHOR_SITE_URL, REPO_URL } from '@/lib/author.ts';
import { localizedPath, SITE_URL, type Lang } from '@/lib/publicPages.ts';

// Stable JSON-LD node ids, the same on every page and in both languages, so search engines merge
// the nodes into one entity. Julien Kilo (a person, no company yet) publishes the site.
export const PERSON_ID = `${SITE_URL}/#person`;
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const APP_ID = `${SITE_URL}/#app`;

export const PERSON_REF = { '@id': PERSON_ID };
export const WEBSITE_REF = { '@id': WEBSITE_ID };

// The publisher, the brand and the site: add them to the `@graph` of every page that has JSON-LD,
// so the references above resolve on the page itself.
export function entityNodes(lang: Lang) {
  return [
    {
      '@type': 'Person',
      '@id': PERSON_ID,
      name: AUTHOR_NAME,
      url: `${SITE_URL}${localizedPath('/about', lang)}`,
      sameAs: [AUTHOR_SITE_URL, AUTHOR_LINKEDIN_URL, AUTHOR_GITHUB_URL],
    },
    {
      '@type': 'Organization',
      '@id': ORGANIZATION_ID,
      name: 'Rature',
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/android-chrome-512x512.png` },
      founder: PERSON_REF,
    },
    {
      '@type': 'WebSite',
      '@id': WEBSITE_ID,
      name: 'Rature',
      url: SITE_URL,
      inLanguage: ['fr', 'en'],
      publisher: PERSON_REF,
    },
  ];
}

export function webApplication(lang: Lang, description: string, audienceType: string, featureList: string[]) {
  return {
    '@type': 'WebApplication',
    '@id': APP_ID,
    name: 'Rature',
    url: `${SITE_URL}${localizedPath('/', lang)}`,
    description,
    applicationCategory: 'SecurityApplication',
    operatingSystem: 'Web',
    isAccessibleForFree: true,
    license: 'https://www.gnu.org/licenses/agpl-3.0.html',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
    author: PERSON_REF,
    publisher: PERSON_REF,
    brand: { '@id': ORGANIZATION_ID },
    sameAs: [REPO_URL],
    inLanguage: lang,
    audience: { '@type': 'Audience', audienceType },
    featureList,
  };
}
