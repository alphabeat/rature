import type { MetaDescriptor } from 'react-router';

import { isGuidePath, localizedPath, publicPage, SITE_URL, type Lang, type TranslatedPath } from '@/lib/publicPages.ts';

export const OG_IMAGE = `${SITE_URL}/og-image.png`;

const OG_LOCALE: Record<Lang, string> = { fr: 'fr_FR', en: 'en_US' };

const OG_IMAGE_ALT: Record<Lang, string> = {
  fr: 'Rature : anonymisez vos PDF, sans serveur, confidentialité totale.',
  en: 'Rature: anonymize your PDFs, no server, full privacy.',
};

type PageCopy = {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  jsonLd?: Record<string, unknown>;
};

function softwareApplication(description: string, audienceType: string, featureList: string[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Rature',
    description,
    applicationCategory: 'SecurityApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
    audience: { '@type': 'Audience', audienceType },
    featureList,
  };
}

// One entry per public page, both languages side by side so they can't drift.
const PAGES: Record<TranslatedPath, Record<Lang, PageCopy>> = {
  '/': {
    fr: {
      title: 'Anonymiser un PDF gratuitement, sans envoi de fichier | Rature',
      description: 'Anonymisez un PDF avant de le partager ou de le confier à ChatGPT. Détection automatique des données personnelles, dans votre navigateur. Gratuit et open source.',
      ogTitle: 'Rature | Anonymisez vos PDF avant de les confier à une IA',
      ogDescription: 'Outil d\'anonymisation de documents PDF, 100% local. Aucune donnée ne quitte votre navigateur. Idéal pour juristes, DPO et avocats.',
      jsonLd: softwareApplication(
        'Outil d\'anonymisation de documents PDF fonctionnant 100% dans le navigateur. Aucune donnée ne quitte votre poste.',
        'Juristes, DPO, Avocats, Professionnels de la conformité, Consultants',
        [
          'Anonymisation de PDF 100% locale',
          'Aucun envoi de données vers un serveur',
          'Fonctionne dans le navigateur (WebAssembly/WebGPU)',
          'Compatible avec tout agent IA',
        ],
      ),
    },
    en: {
      title: 'Redact a PDF for free, without uploading it | Rature',
      description: 'Redact a PDF before sharing it or giving it to ChatGPT. Personal data is detected automatically, in your browser. Free and open source.',
      ogTitle: 'Rature | Anonymize your PDFs before handing them to an AI',
      ogDescription: 'PDF anonymization tool that runs 100% locally. No data leaves your browser. Built for lawyers, DPOs and compliance teams.',
      jsonLd: softwareApplication(
        'PDF anonymization tool that runs 100% in the browser. No data leaves your device.',
        'Lawyers, DPOs, Legal professionals, Compliance professionals, Consultants',
        [
          '100% local PDF anonymization',
          'No data sent to any server',
          'Runs in the browser (WebAssembly/WebGPU)',
          'Works with any AI agent',
        ],
      ),
    },
  },
  '/about': {
    fr: {
      title: 'À propos | Rature, anonymisation de PDF dans le navigateur',
      description: 'Pourquoi Rature existe et comment il fonctionne : détection automatique des données sensibles, traitement 100% local dans le navigateur, code source ouvert.',
    },
    en: {
      title: 'About | Rature, PDF anonymization in the browser',
      description: 'Why Rature exists and how it works: automatic detection of sensitive data, 100% local processing in the browser, open source code.',
    },
  },
  '/privacy-policy': {
    fr: {
      title: 'Politique de confidentialité | Rature',
      description: 'Rature traite vos documents uniquement dans votre navigateur : aucun fichier n\'est envoyé. Détail de la mesure d\'audience anonyme et de vos droits.',
    },
    en: {
      title: 'Privacy policy | Rature',
      description: 'Rature processes your documents only in your browser: no file is uploaded. Details on the anonymous audience measurement and your rights.',
    },
  },
  '/legal-notice': {
    fr: {
      title: 'Mentions légales | Rature',
      description: 'Mentions légales de Rature : éditeur, hébergeur et contact.',
    },
    en: {
      title: 'Legal notice | Rature',
      description: 'Legal notice for Rature: publisher, hosting provider and contact.',
    },
  },
};

export type HeadOptions = {
  // The French path; the English URL is `localizedPath(path, 'en')`.
  path: string;
  lang: Lang;
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  ogType?: 'website' | 'article';
  // Replaces the default share image (absolute URL, 1200x630) and its alt text.
  ogImage?: { url: string; alt: string };
  ogExtra?: MetaDescriptor[];
  jsonLd?: Record<string, unknown>;
};

export function head({ path, lang, title, description, ogTitle = title, ogDescription = description, ogType = 'website', ogImage = { url: OG_IMAGE, alt: OG_IMAGE_ALT[lang] }, ogExtra = [], jsonLd }: HeadOptions): MetaDescriptor[] {
  const url = `${SITE_URL}${localizedPath(path, lang)}`;
  const altLang: Lang = lang === 'fr' ? 'en' : 'fr';

  return [
    { title },
    { name: 'description', content: description },
    { tagName: 'link', rel: 'canonical', href: url },
    { tagName: 'link', rel: 'alternate', hrefLang: 'fr', href: `${SITE_URL}${path}` },
    { tagName: 'link', rel: 'alternate', hrefLang: 'en', href: `${SITE_URL}${localizedPath(path, 'en')}` },
    { tagName: 'link', rel: 'alternate', hrefLang: 'x-default', href: `${SITE_URL}${path}` },
    { property: 'og:type', content: ogType },
    ...ogExtra,
    { property: 'og:title', content: ogTitle },
    { property: 'og:description', content: ogDescription },
    { property: 'og:url', content: url },
    { property: 'og:locale', content: OG_LOCALE[lang] },
    { property: 'og:locale:alternate', content: OG_LOCALE[altLang] },
    { property: 'og:site_name', content: 'Rature' },
    { property: 'og:image', content: ogImage.url },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:image:alt', content: ogImage.alt },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: ogTitle },
    { name: 'twitter:description', content: ogDescription },
    { name: 'twitter:image', content: ogImage.url },
    // A key next to `@graph` would turn the graph into a named one: graph nodes set their own language.
    ...(jsonLd ? [{ 'script:ld+json': '@graph' in jsonLd ? jsonLd : { ...jsonLd, inLanguage: lang } }] : []),
  ];
}

// Meta for a public page, in the language of the URL being rendered.
export function pageMeta(pathname: string): MetaDescriptor[] {
  const page = publicPage(pathname);
  if (!page || isGuidePath(page.path)) return appMeta;

  const { path, lang } = page;
  return head({ path, lang, ...PAGES[path][lang] });
}

// App routes hold an in-memory document: nothing to index there.
export const appMeta: MetaDescriptor[] = [
  { title: 'Rature' },
  { name: 'robots', content: 'noindex' },
];

// Served for every unknown URL (`404.html`).
export const notFoundMeta: MetaDescriptor[] = [
  { title: 'Page introuvable | Rature' },
  { name: 'robots', content: 'noindex' },
];
