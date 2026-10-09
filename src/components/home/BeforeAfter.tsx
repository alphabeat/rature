import type { ReactNode } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { HomeSection } from '@/components/home/HomeSection.tsx';
import { COLORS } from '@/lib/colors.ts';

const ENTITY_COLORS = {
  per: COLORS.highlight.blue,
  loc: COLORS.highlight.green,
  phone: COLORS.highlight.red,
  email: COLORS.highlight.amber,
} as const;

const cardClass = 'flex flex-col gap-4 bg-card border border-border-theme shadow-sm p-6 dark:bg-surface-subtle dark:shadow-none';

function Highlight({ className, children }: { className: string; children?: ReactNode }) {
  return <span className={`px-0.5 ${className}`}>{children}</span>;
}

// Same text and box as the highlight, painted over, so both columns wrap identically.
// The excerpt is fictional; the text stays unselectable and hidden from screen readers.
function Redacted({ label, children }: { label: string; children?: ReactNode }) {
  return (
    <span role="img" aria-label={label} className="px-0.5 border-b-2 border-transparent bg-fg text-transparent select-none">
      {children}
    </span>
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
      <div className="w-full grid gap-6 md:grid-cols-2">
        <figure className={cardClass}>
          <figcaption className="text-xs font-semibold tracking-wider uppercase text-fg-muted">
            {t('home.beforeAfter.before')}
          </figcaption>
          <p className="text-sm text-fg leading-loose">
            <Trans i18nKey="home.beforeAfter.excerpt" components={before} />
          </p>
        </figure>
        <figure className={cardClass}>
          <figcaption className="text-xs font-semibold tracking-wider uppercase text-accent">
            {t('home.beforeAfter.after')}
          </figcaption>
          <p className="text-sm text-fg leading-loose">
            <Trans i18nKey="home.beforeAfter.excerpt" components={after} />
          </p>
        </figure>
      </div>
    </HomeSection>
  );
}
