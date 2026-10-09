import { useTranslation } from 'react-i18next';

import { HomeSection } from '@/components/home/HomeSection.tsx';

const USE_CASES = ['ai', 'share', 'gdpr', 'publish'] as const;

export function UseCases() {
  const { t } = useTranslation();

  return (
    <HomeSection id="use-cases" title={t('home.useCases.title')}>
      <ul className="w-full grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {USE_CASES.map(key => (
          <li
            key={key}
            className="flex flex-col gap-3 bg-card border border-border-theme shadow-sm p-6 dark:bg-surface-subtle dark:shadow-none"
          >
            <h3 className="text-base font-bold text-fg">{t(`home.useCases.items.${key}.title`)}</h3>
            <p className="text-sm text-fg-muted leading-relaxed">{t(`home.useCases.items.${key}.desc`)}</p>
          </li>
        ))}
      </ul>
    </HomeSection>
  );
}
