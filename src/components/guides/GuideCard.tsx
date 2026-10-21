import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';

import type { Guide } from '@/guides/types.ts';
import { useLocalizedPath } from '@/hooks/useLocalizedPath.ts';

export function GuideCard({ guide }: { guide: Guide }) {
  const { t } = useTranslation();
  const localize = useLocalizedPath();

  return (
    <li className="flex">
      <Link
        to={localize(guide.path)}
        className="group flex flex-col gap-3 w-full bg-card border border-border-theme shadow-sm p-6 hover:border-accent transition-colors dark:bg-surface-subtle dark:shadow-none"
      >
        <h3 className="text-lg font-bold text-fg group-hover:text-accent transition-colors">{guide.card.title}</h3>
        <p className="text-sm text-fg-muted leading-relaxed">{guide.card.line}</p>
        <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
          {t('guides.readGuide')}
          <ArrowRight size={14} aria-hidden="true" />
        </span>
      </Link>
    </li>
  );
}
