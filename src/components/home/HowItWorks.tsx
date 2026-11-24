import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { HomeSection } from '@/components/home/HomeSection.tsx';
import { MiniSheet, type SheetState } from '@/components/home/MiniSheet.tsx';

// Each step shows the same page at that point: as dropped, with its detections, as exported.
const STEPS: { key: 'drop' | 'review' | 'export'; sheet: SheetState }[] = [
  { key: 'drop', sheet: 'plain' },
  { key: 'review', sheet: 'detected' },
  { key: 'export', sheet: 'redacted' },
];

export function HowItWorks() {
  const { t } = useTranslation();

  return (
    <HomeSection id="how-it-works" title={t('home.howItWorks.title')}>
      <ol className="w-full grid gap-12 md:gap-8 md:grid-cols-3">
        {STEPS.map(({ key, sheet }, index) => (
          <li key={key} className="relative flex flex-col gap-3">
            <MiniSheet state={sheet} size="sm" className="mb-5" />
            {/* Arrow from this page to the next one, across the column gap. */}
            {index < STEPS.length - 1 && (
              <div
                aria-hidden="true"
                className="hidden md:flex absolute top-14 left-24 -right-5 -translate-y-1/2 items-center text-teal-600 dark:text-teal-400"
              >
                <span className="flex-1 h-px bg-current opacity-40" />
                <ArrowRight size={18} strokeWidth={1.5} className="-ml-1 shrink-0" />
              </div>
            )}
            <h3 className="text-lg font-medium text-fg">{t(`home.howItWorks.steps.${key}.title`)}</h3>
            <p className="text-sm leading-6 text-fg-muted">{t(`home.howItWorks.steps.${key}.desc`)}</p>
          </li>
        ))}
      </ol>
    </HomeSection>
  );
}
