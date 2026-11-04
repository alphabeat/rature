import { useTranslation } from 'react-i18next';

import { HomeSection } from '@/components/home/HomeSection.tsx';

const STEPS = ['drop', 'review', 'export'] as const;

export function HowItWorks() {
  const { t } = useTranslation();

  return (
    <HomeSection id="how-it-works" title={t('home.howItWorks.title')}>
      <ol className="w-full grid gap-6 md:grid-cols-3">
        {STEPS.map((key, index) => (
          <li
            key={key}
            className="flex flex-col gap-3 bg-card border border-border-theme shadow-sm p-6 dark:bg-surface-subtle dark:shadow-none"
          >
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 shrink-0 rounded-full bg-accent/10 text-sm font-bold text-accent">
                {index + 1}
              </span>
              <h3 className="text-base font-bold text-fg">{t(`home.howItWorks.steps.${key}.title`)}</h3>
            </div>
            <p className="text-sm text-fg-muted leading-relaxed">{t(`home.howItWorks.steps.${key}.desc`)}</p>
          </li>
        ))}
      </ol>
    </HomeSection>
  );
}
