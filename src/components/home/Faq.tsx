import { ChevronDown } from 'lucide-react';
import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import { HomeSection } from '@/components/home/HomeSection.tsx';
import { useLocalizedPath } from '@/hooks/useLocalizedPath.ts';
import type { GuidePath } from '@/lib/publicPages.ts';

const QUESTIONS = ['online', 'upload', 'recover', 'free', 'detection', 'chatgpt', 'firstLoad'] as const;

// Some answers end with a link to a guide (`<guide>` tag).
const GUIDE_LINKS: Partial<Record<(typeof QUESTIONS)[number], GuidePath>> = {
  recover: '/guides/verifier-caviardage-pdf',
  chatgpt: '/guides/anonymiser-pdf-avant-chatgpt',
};

// Native <details> so every answer is in the prerendered HTML and works without JS.
export function Faq() {
  const { t } = useTranslation();
  const localize = useLocalizedPath();

  return (
    <HomeSection id="faq" title={t('home.faq.title')}>
      <div className="w-full flex flex-col border-t border-border-theme">
        {QUESTIONS.map(key => (
          <details key={key} className="group border-b border-border-theme">
            <summary className="flex items-center justify-between gap-4 py-5 cursor-pointer list-none [&::-webkit-details-marker]:hidden text-base font-medium text-fg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
              <h3>{t(`home.faq.items.${key}.q`)}</h3>
              <ChevronDown
                size={18}
                strokeWidth={1.5}
                className="shrink-0 text-fg-muted group-hover:text-fg transition-[color,transform] duration-200 group-open:rotate-180"
                aria-hidden="true"
              />
            </summary>
            <p className="pb-6 pr-10 text-sm leading-6 text-fg-muted">
              <Trans
                i18nKey={`home.faq.items.${key}.a`}
                components={{ guide: <Link to={localize(GUIDE_LINKS[key] ?? '/guides')} className="text-accent underline underline-offset-4 hover:text-accent-hover transition-colors" /> }}
              />
            </p>
          </details>
        ))}
      </div>
    </HomeSection>
  );
}
