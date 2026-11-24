import type { ReactNode } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { HomeSection } from '@/components/home/HomeSection.tsx';

// The pages stay paper-colored in both themes, so these are the light review colors only.
const ENTITY_COLORS = {
  per: 'bg-blue-200/70 border-b-2 border-blue-400',
  loc: 'bg-green-200/70 border-b-2 border-green-400',
  phone: 'bg-red-200/70 border-b-2 border-red-400',
  email: 'bg-amber-200/70 border-b-2 border-amber-400',
} as const;

function Highlight({ className, children }: { className: string; children?: ReactNode }) {
  return <span className={`px-0.5 ${className}`}>{children}</span>;
}

// Same text and box as the highlight, painted over, so both pages wrap identically.
// The excerpt is fictional; the text stays unselectable and hidden from screen readers.
function Redacted({ label, children }: { label: string; children?: ReactNode }) {
  return (
    <span role="img" aria-label={label} className="px-0.5 border-b-2 border-transparent bg-neutral-900 text-transparent select-none">
      {children}
    </span>
  );
}

function Page({ caption, captionClass, children }: { caption: string; captionClass: string; children: ReactNode }) {
  return (
    <figure className="flex flex-col gap-3">
      <figcaption className={`text-sm font-medium ${captionClass}`}>{caption}</figcaption>
      <div className="bg-[#fdfcf9] border border-black/5 px-6 py-8 sm:px-10 sm:py-10 shadow-[0_1px_2px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
        <p className="font-serif text-[15px] leading-8 text-neutral-800">{children}</p>
      </div>
    </figure>
  );
}

export function BeforeAfter() {
  const { t } = useTranslation();
  const redacted = t('home.beforeAfter.redacted');

  const before = Object.fromEntries(
    Object.entries(ENTITY_COLORS).map(([tag, className]) => [tag, <Highlight className={className} />]),
  );
  const after = Object.fromEntries(
    Object.keys(ENTITY_COLORS).map(tag => [tag, <Redacted label={redacted} />]),
  );

  return (
    <HomeSection id="before-after" title={t('home.beforeAfter.title')} intro={t('home.beforeAfter.intro')}>
      <div className="w-full grid gap-8 md:grid-cols-2">
        <Page caption={t('home.beforeAfter.before')} captionClass="text-fg-muted">
          <Trans i18nKey="home.beforeAfter.excerpt" components={before} />
        </Page>
        <Page caption={t('home.beforeAfter.after')} captionClass="text-accent">
          <Trans i18nKey="home.beforeAfter.excerpt" components={after} />
        </Page>
      </div>
    </HomeSection>
  );
}
