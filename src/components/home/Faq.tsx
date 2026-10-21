import { ChevronDown } from 'lucide-react';
import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import { HomeSection } from '@/components/home/HomeSection.tsx';

const QUESTIONS = ['upload', 'recover', 'free', 'detection', 'chatgpt', 'firstLoad'] as const;

// French answers end with a link to a guide (`<guide>` tag); the English ones have none.
const GUIDE_LINKS: Partial<Record<(typeof QUESTIONS)[number], string>> = {
  recover: '/guides/verifier-caviardage-pdf',
  chatgpt: '/guides/anonymiser-pdf-avant-chatgpt',
};

// Native <details> so every answer is in the prerendered HTML and works without JS.
export function Faq() {
  const { t } = useTranslation();

  return (
    <HomeSection id="faq" title={t('home.faq.title')}>
      <div className="w-full max-w-3xl flex flex-col gap-3">
        {QUESTIONS.map(key => (
          <details
            key={key}
            className="group bg-card border border-border-theme shadow-sm dark:bg-surface-subtle dark:shadow-none"
          >
            <summary className="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden text-base font-bold text-fg hover:text-accent transition-colors">
              <h3>{t(`home.faq.items.${key}.q`)}</h3>
              <ChevronDown size={18} className="shrink-0 text-fg-muted transition-transform group-open:rotate-180" aria-hidden="true" />
            </summary>
            <p className="px-6 pb-5 text-sm text-fg-muted leading-relaxed">
              <Trans
                i18nKey={`home.faq.items.${key}.a`}
                components={{ guide: <Link to={GUIDE_LINKS[key] ?? '/guides'} className="text-accent underline underline-offset-4 hover:text-accent-hover" /> }}
              />
            </p>
          </details>
        ))}
      </div>
    </HomeSection>
  );
}
