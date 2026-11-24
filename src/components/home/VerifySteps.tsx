import { ArrowRight } from 'lucide-react';
import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import { HomeSection } from '@/components/home/HomeSection.tsx';
import { useLocalizedPath } from '@/hooks/useLocalizedPath.ts';

const STEPS = ['network', 'source'] as const;

// Figures from the guide's test: what ChatGPT read back from each file.
const STATS = [
  { key: 'word', value: '17 / 17', color: 'text-red-600 dark:text-[#e5484d]' },
  { key: 'rature', value: '0 / 17', color: 'text-teal-700 dark:text-teal-300' },
] as const;

export function VerifySteps() {
  const { t } = useTranslation();
  const localize = useLocalizedPath();

  return (
    <HomeSection id="verify" title={t('home.verify.title')} intro={t('home.verify.intro')}>
      <ol className="w-full grid gap-8 md:grid-cols-2">
        {STEPS.map((key, index) => (
          <li key={key} className="flex flex-col gap-3">
            <span className="font-mono text-sm text-teal-700 dark:text-teal-400 tabular-nums">
              {String(index + 1).padStart(2, '0')}
            </span>
            <h3 className="text-lg font-medium text-fg">{t(`home.verify.steps.${key}.title`)}</h3>
            <p className="text-sm leading-6 text-fg-muted">
              <Trans
                i18nKey={`home.verify.steps.${key}.desc`}
                components={{
                  github: (
                    <a
                      href="https://github.com/alphabeat/rature"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent underline underline-offset-4 hover:text-accent-hover transition-colors"
                    />
                  ),
                }}
              />
            </p>
          </li>
        ))}
      </ol>

      <figure className="w-full flex flex-col gap-4">
        <figcaption className="text-sm text-fg-muted">{t('home.verify.stats.caption')}</figcaption>
        <div className="grid gap-6 sm:grid-cols-2">
          {STATS.map(stat => (
            <div key={stat.key} className="flex flex-col gap-3 bg-card border border-border-theme px-6 py-8">
              <p className={`font-mono text-5xl font-medium tabular-nums tracking-[-0.02em] ${stat.color}`}>{stat.value}</p>
              <p className="text-sm leading-6 text-fg-muted">{t(`home.verify.stats.${stat.key}`)}</p>
            </div>
          ))}
        </div>
        <Link
          to={localize('/guides/verifier-caviardage-pdf')}
          className="self-start inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-hover transition-colors"
        >
          {t('home.verify.stats.link')}
          <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
        </Link>
      </figure>
    </HomeSection>
  );
}
