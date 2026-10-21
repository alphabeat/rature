import type { MetaDescriptor } from 'react-router';

import { GUIDES, GUIDES_DATE, HUB } from '@/guides/index.ts';
import { plainText } from '@/guides/inline.ts';
import type { Guide } from '@/guides/types.ts';
import { SITE_URL } from '@/lib/publicPages.ts';
import { head, OG_IMAGE } from '@/lib/seo.ts';

function breadcrumbList(items: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

const HUB_CRUMB = [{ name: 'Accueil', path: '/' }, { name: 'Guides', path: '/guides' }];

function guideJsonLd(guide: Guide, image: string) {
  const url = `${SITE_URL}${guide.path}`;
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
          url: `${SITE_URL}/about`,
          sameAs: 'https://github.com/alphabeat',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Rature',
          logo: { '@type': 'ImageObject', url: `${SITE_URL}/android-chrome-512x512.png` },
        },
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        inLanguage: 'fr',
        image,
      },
      breadcrumbList([...HUB_CRUMB, { name: guide.breadcrumb, path: guide.path }]),
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

function hubJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: HUB.heading,
        description: HUB.description,
        url: `${SITE_URL}${HUB.path}`,
        hasPart: GUIDES.map((guide) => ({ '@type': 'Article', headline: guide.heading, url: `${SITE_URL}${guide.path}` })),
      },
      breadcrumbList(HUB_CRUMB),
    ],
  };
}

export function hubMeta(): MetaDescriptor[] {
  return head({ path: HUB.path, lang: 'fr', title: HUB.title, description: HUB.description, alternates: false, jsonLd: hubJsonLd() });
}

export function guideMeta(guide: Guide): MetaDescriptor[] {
  const ogImage = guide.ogImage && { url: `${SITE_URL}/guides/${guide.ogImage.file}`, alt: guide.ogImage.alt };
  return head({
    path: guide.path,
    lang: 'fr',
    title: guide.title,
    description: guide.description,
    ogTitle: guide.ogTitle,
    alternates: false,
    ogType: 'article',
    ogImage,
    ogExtra: [
      { property: 'article:published_time', content: GUIDES_DATE },
      { property: 'article:modified_time', content: GUIDES_DATE },
    ],
    jsonLd: guideJsonLd(guide, ogImage?.url ?? OG_IMAGE),
  });
}
