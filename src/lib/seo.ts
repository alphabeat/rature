import type { MetaDescriptor } from 'react-router';

import { localizedPath, publicPage, type Lang, type PublicPath } from '@/lib/publicPages.ts';

export const SITE_URL = 'https://rature.fr';

const OG_IMAGE = `${SITE_URL}/og-image.png`;

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
const PAGES: Record<PublicPath, Record<Lang, PageCopy>> = {
  '/': {
    fr: {
      title: 'Rature | Anonymisation de PDF 100% locale et sécurisée',
      description: 'Anonymisez vos documents PDF directement dans votre navigateur, sans envoi de données. Rature protège vos informations confidentielles avant tout partage avec une IA.',
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
      title: 'Rature | 100% local, private PDF anonymization',
      description: 'Anonymize your PDF documents directly in your browser, with no upload. Rature protects your confidential information before you share it with an AI.',
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
};

// Meta for a public page, in the language of the URL being rendered.
export function pageMeta(pathname: string): MetaDescriptor[] {
  const page = publicPage(pathname);
  if (!page) return appMeta;

  const { path, lang } = page;
  const { title, description, ogTitle = title, ogDescription = description, jsonLd } = PAGES[path][lang];
  const url = `${SITE_URL}${localizedPath(path, lang)}`;
  const altLang: Lang = lang === 'fr' ? 'en' : 'fr';

  return [
    { title },
    { name: 'description', content: description },
    { tagName: 'link', rel: 'canonical', href: url },
    { tagName: 'link', rel: 'alternate', hrefLang: 'fr', href: `${SITE_URL}${path}` },
    { tagName: 'link', rel: 'alternate', hrefLang: 'en', href: `${SITE_URL}${localizedPath(path, 'en')}` },
    { tagName: 'link', rel: 'alternate', hrefLang: 'x-default', href: `${SITE_URL}${path}` },
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: ogTitle },
    { property: 'og:description', content: ogDescription },
    { property: 'og:url', content: url },
    { property: 'og:locale', content: OG_LOCALE[lang] },
    { property: 'og:locale:alternate', content: OG_LOCALE[altLang] },
    { property: 'og:site_name', content: 'Rature' },
    { property: 'og:image', content: OG_IMAGE },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:image:alt', content: OG_IMAGE_ALT[lang] },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: ogTitle },
    { name: 'twitter:description', content: ogDescription },
    { name: 'twitter:image', content: OG_IMAGE },
    ...(jsonLd ? [{ 'script:ld+json': { ...jsonLd, inLanguage: lang } }] : []),
  ];
}

// App routes hold an in-memory document: nothing to index there.
export const appMeta: MetaDescriptor[] = [
  { title: 'Rature' },
  { name: 'robots', content: 'noindex' },
];
