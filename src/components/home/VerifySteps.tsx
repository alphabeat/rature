import { Trans, useTranslation } from 'react-i18next';

import { HomeSection } from '@/components/home/HomeSection.tsx';

const STEPS = ['network', 'source'] as const;

export function VerifySteps() {
  const { t } = useTranslation();

  return (
    <HomeSection id="verify" title={t('home.verify.title')} intro={t('home.verify.intro')}>
      <ol className="w-full grid gap-6 md:grid-cols-2">
        {STEPS.map((key, index) => (
          <li
            key={key}
            className="flex flex-col gap-3 bg-card border border-border-theme shadow-sm p-6 dark:bg-surface-subtle dark:shadow-none"
          >
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 shrink-0 rounded-full bg-accent/10 text-sm font-bold text-accent">
                {index + 1}
              </span>
              <h3 className="text-base font-bold text-fg">{t(`home.verify.steps.${key}.title`)}</h3>
            </div>
            <p className="text-sm text-fg-muted leading-relaxed">
              <Trans
                i18nKey={`home.verify.steps.${key}.desc`}
                components={{
                  github: (
                    <a
                      href="https://github.com/alphabeat/rature"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent underline underline-offset-4 hover:text-accent-hover"
                    />
                  ),
                }}
              />
            </p>
          </li>
        ))}
      </ol>
    </HomeSection>
  );
}
