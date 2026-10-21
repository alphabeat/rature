import type { MetaDescriptor } from 'react-router';

import { GUIDES, GUIDES_DATE, HUB } from '@/guides/index.ts';
import { plainText } from '@/guides/inline.ts';
import type { Guide } from '@/guides/types.ts';
import { localizedPath, SITE_URL, type Lang } from '@/lib/publicPages.ts';
import { head, OG_IMAGE } from '@/lib/seo.ts';

function breadcrumbList(lang: Lang, items: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${localizedPath(item.path, lang)}`,
    })),
  };
}

const HUB_CRUMB: Record<Lang, { name: string; path: string }[]> = {
  fr: [{ name: 'Accueil', path: '/' }, { name: 'Guides', path: '/guides' }],
  en: [{ name: 'Home', path: '/' }, { name: 'Guides', path: '/guides' }],
};

function guideJsonLd(guide: Guide, lang: Lang, image: string) {
  const url = `${SITE_URL}${localizedPath(guide.path, lang)}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: guide.heading,
        description: guide.description,
        datePublished: GUIDES_DATE,
        dateModified: GUIDES_DATE,
        author: {
          '@type': 'Person',
          name: 'Julien Kilo',
          url: `${SITE_URL}${localizedPath('/about', lang)}`,
          sameAs: 'https://github.com/alphabeat',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Rature',
          logo: { '@type': 'ImageObject', url: `${SITE_URL}/android-chrome-512x512.png` },
        },
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        inLanguage: lang,
        image,
      },
      breadcrumbList(lang, [...HUB_CRUMB[lang], { name: guide.breadcrumb, path: guide.path }]),
      {
        '@type': 'FAQPage',
        mainEntity: guide.faq.map(({ q, a }) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: a },
        })),
      },
      ...(guide.howTo ? [{
        '@type': 'HowTo',
        name: guide.howTo.name,
        step: guide.howTo.steps.map((step, index) => ({
          '@type': 'HowToStep',
          position: index + 1,
          name: step.title,
          text: plainText(step.text),
        })),
      }] : []),
    ],
  };
}

function hubJsonLd(lang: Lang) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: HUB[lang].heading,
        description: HUB[lang].description,
        url: `${SITE_URL}${localizedPath('/guides', lang)}`,
        inLanguage: lang,
        hasPart: GUIDES[lang].map((guide) => ({ '@type': 'Article', headline: guide.heading, url: `${SITE_URL}${localizedPath(guide.path, lang)}` })),
      },
      breadcrumbList(lang, HUB_CRUMB[lang]),
    ],
  };
}

export function hubMeta(lang: Lang): MetaDescriptor[] {
  const { title, description } = HUB[lang];
  return head({ path: '/guides', lang, title, description, jsonLd: hubJsonLd(lang) });
}

export function guideMeta(guide: Guide, lang: Lang): MetaDescriptor[] {
  const ogImage = guide.ogImage && { url: `${SITE_URL}${guide.ogImage.src}`, alt: guide.ogImage.alt };
  return head({
    path: guide.path,
    lang,
    title: guide.title,
    description: guide.description,
    ogTitle: guide.ogTitle,
    ogType: 'article',
    ogImage,
    ogExtra: [
      { property: 'article:published_time', content: GUIDES_DATE },
      { property: 'article:modified_time', content: GUIDES_DATE },
    ],
    jsonLd: guideJsonLd(guide, lang, ogImage?.url ?? OG_IMAGE),
  });
}
