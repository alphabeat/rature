import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';

import { GuideCard } from '@/components/guides/GuideCard.tsx';
import { Footer } from '@/components/home/Footer.tsx';
import { Navbar } from '@/components/Navbar.tsx';
import { GUIDES, HUB } from '@/guides/index.ts';

export function GuidesHubPage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col justify-between flex-1 h-full">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-3xl px-6 pt-36 md:pt-40 pb-16 flex flex-col gap-10">
        <header className="flex flex-col gap-4">
          <nav aria-label={t('guides.breadcrumb')}>
            <ol className="flex flex-wrap items-center gap-2 text-sm text-fg-muted">
              <li><Link to="/" className="hover:text-fg transition-colors">{t('guides.breadcrumbHome')}</Link></li>
              <li aria-hidden="true">&gt;</li>
              <li aria-current="page">{t('guides.nav')}</li>
            </ol>
          </nav>
          <h1 className="text-4xl font-extrabold tracking-tight leading-[1.1] text-fg">{HUB.heading}</h1>
          <p className="text-base text-fg-muted leading-relaxed">{HUB.intro}</p>
        </header>

        <ul className="grid gap-4">
          {GUIDES.map((guide) => <GuideCard key={guide.path} guide={guide} />)}
        </ul>
      </main>

      <Footer />
    </div>
  );
}
