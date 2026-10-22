import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';

import { GuideCard } from '@/components/guides/GuideCard.tsx';
import { Inline } from '@/components/guides/GuideBlocks.tsx';
import { Footer } from '@/components/home/Footer.tsx';
import { Navbar } from '@/components/Navbar.tsx';
import { GUIDES_DATE, guideByPath } from '@/guides/index.ts';
import type { Guide } from '@/guides/types.ts';
import { useLocalizedPath } from '@/hooks/useLocalizedPath.ts';
import { AUTHOR_LINKEDIN_URL, AUTHOR_NAME } from '@/lib/author.ts';
import type { Lang } from '@/lib/publicPages.ts';

const H2_CLASS = 'text-3xl font-extrabold tracking-tight text-fg scroll-mt-32';

const DATE_LOCALE: Record<Lang, string> = { fr: 'fr-FR', en: 'en-US' };

export function GuidePage({ guide, lang }: { guide: Guide; lang: Lang }) {
  const { t } = useTranslation();
  const localize = useLocalizedPath();
  const date = new Date(GUIDES_DATE).toLocaleDateString(DATE_LOCALE[lang], { dateStyle: 'long', timeZone: 'UTC' });
  const toc = [
    ...guide.sections,
    { id: 'questions-frequentes', title: t('guides.faq') },
    { id: 'sources', title: t('guides.sources') },
  ];

  return (
    <div className="flex flex-col justify-between flex-1 h-full">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-3xl px-6 pt-36 md:pt-40 pb-16 flex flex-col gap-10 text-base leading-relaxed">
        <header className="flex flex-col gap-4">
          <nav aria-label={t('guides.breadcrumb')}>
            <ol className="flex flex-wrap items-center gap-2 text-sm text-fg-muted">
              <li><Link to={localize('/')} className="hover:text-fg transition-colors">{t('guides.breadcrumbHome')}</Link></li>
              <li aria-hidden="true">&gt;</li>
              <li><Link to={localize('/guides')} className="hover:text-fg transition-colors">{t('guides.nav')}</Link></li>
              <li aria-hidden="true">&gt;</li>
              <li aria-current="page">{guide.breadcrumb}</li>
            </ol>
          </nav>
          <h1 className="text-4xl font-extrabold tracking-tight leading-[1.1] text-fg">{guide.heading}</h1>
          <p className="text-sm text-fg-muted">
            {t('guides.by')} <a href={AUTHOR_LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-fg">{AUTHOR_NAME}</a>, {t('guides.authorRole')}
            {' · '}
            <time dateTime={GUIDES_DATE}>{t('guides.updated', { date })}</time>
            {' · '}
            {t('guides.readingTime', { count: guide.readingTime })}
          </p>
        </header>

        <aside className="flex flex-col gap-3 border-l-4 border-accent bg-card shadow-sm p-5 dark:bg-surface-subtle dark:shadow-none">
          <p className="text-sm font-bold uppercase tracking-wider text-accent">{t('guides.summary')}</p>
          {guide.summary}
        </aside>

        <nav aria-labelledby="sommaire" className="flex flex-col gap-3 border border-border-theme bg-card shadow-sm p-5 dark:bg-surface-subtle dark:shadow-none">
          <p id="sommaire" className="text-sm font-bold uppercase tracking-wider text-fg-muted">{t('guides.toc')}</p>
          <ol className="flex flex-col gap-1.5 pl-5 list-decimal marker:text-fg-muted">
            {toc.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className="text-accent underline underline-offset-4 hover:text-accent-hover">{item.title}</a>
              </li>
            ))}
          </ol>
        </nav>

        {guide.sections.map((section) => (
          <section key={section.id} aria-labelledby={section.id} className="flex flex-col gap-4">
            <h2 id={section.id} className={H2_CLASS}>{section.title}</h2>
            {section.content}
          </section>
        ))}

        <section aria-labelledby="questions-frequentes" className="flex flex-col gap-4">
          <h2 id="questions-frequentes" className={H2_CLASS}>{t('guides.faq')}</h2>
          <div className="flex flex-col gap-3">
            {guide.faq.map((item) => (
              <details
                key={item.q}
                className="group bg-card border border-border-theme shadow-sm dark:bg-surface-subtle dark:shadow-none"
              >
                <summary className="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden text-base font-bold text-fg hover:text-accent transition-colors">
                  <h3>{item.q}</h3>
                  <ChevronDown size={18} className="shrink-0 text-fg-muted transition-transform group-open:rotate-180" aria-hidden="true" />
                </summary>
                <p className="px-6 pb-5 text-fg-muted">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section aria-labelledby="sources" className="flex flex-col gap-4">
          <h2 id="sources" className={H2_CLASS}>{t('guides.sources')}</h2>
          <ol className="flex flex-col gap-2 pl-6 list-decimal text-sm text-fg-muted">
            {guide.sources.map((source) => <li key={source}><Inline text={source} /></li>)}
          </ol>
        </section>

        <section aria-labelledby="a-lire-aussi" className="flex flex-col gap-4">
          <h2 id="a-lire-aussi" className={H2_CLASS}>{t('guides.related')}</h2>
          <ul className="grid gap-4 sm:grid-cols-2">
            {guide.related.map((path) => <GuideCard key={path} guide={guideByPath(path, lang)} />)}
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  );
}
