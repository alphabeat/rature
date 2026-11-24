import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { HomeSection } from '@/components/home/HomeSection.tsx';
import { MiniSheet, type SheetState } from '@/components/home/MiniSheet.tsx';
import { cn } from '@/lib/utils.ts';

const STEPS = ['drop', 'review', 'export'] as const;

// The run, once, when the section scrolls into view: the rail fills from step to step and each
// page changes as it is reached. 0 = nothing yet, 4 = done (the resting state).
const DONE = 4;
const PHASE_AT_MS = [200, 900, 1600, 2100];

function sheetState(step: number, phase: number): SheetState {
  if (step === 1) return phase >= 2 ? 'detected' : 'plain';
  if (step === 2) return phase >= 4 ? 'redacted' : phase >= 3 ? 'detected' : 'plain';
  return 'plain';
}

export function HowItWorks() {
  const { t } = useTranslation();
  const listRef = useRef<HTMLOListElement>(null);
  // Prerendered and reduced-motion visitors get the finished state.
  const [phase, setPhase] = useState(DONE);

  useEffect(() => {
    const list = listRef.current;
    if (!list || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Fully on screen at load (a very tall window): keep the finished state, there is no scroll to play on.
    if (list.getBoundingClientRect().bottom <= window.innerHeight) return;

    // Empty the steps before the section is reached (in a frame callback, off screen anyway).
    const reset = requestAnimationFrame(() => setPhase(0));
    const timers: number[] = [];
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      PHASE_AT_MS.forEach((ms, i) => timers.push(window.setTimeout(() => setPhase(i + 1), ms)));
    }, { threshold: 0.6 });
    observer.observe(list);
    return () => {
      cancelAnimationFrame(reset);
      observer.disconnect();
      timers.forEach(clearTimeout);
    };
  }, []);

  const railFill = phase >= 2 ? 1 : phase >= 1 ? 0.5 : 0;

  return (
    <HomeSection id="how-it-works" title={t('home.howItWorks.title')}>
      <ol ref={listRef} className="relative w-full grid gap-12 md:gap-8 md:grid-cols-3">
        {/* The rail runs from the first dot to the last; the last column starts at 100% minus one column. */}
        <div
          aria-hidden="true"
          className="hidden md:block absolute top-[142px] left-1.5 right-[calc((100%-4rem)/3-6px)] -translate-y-1/2"
        >
          <span className="block h-px bg-border-strong" />
          <span
            className="absolute inset-x-0 top-1/2 h-0.5 origin-left bg-teal-600 dark:bg-teal-400 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ transform: `translateY(-50%) scaleX(${railFill})` }}
          />
        </div>

        {STEPS.map((key, index) => {
          const reached = phase >= index + 1;
          return (
            <li key={key} className="flex flex-col">
              <MiniSheet state={sheetState(index, phase)} size="sm" />
              <span
                aria-hidden="true"
                className={cn(
                  'relative hidden md:block mt-6 w-3 h-3 rounded-full border-2 transition-[background-color,border-color,box-shadow] duration-300',
                  reached
                    ? 'bg-teal-600 border-teal-600 shadow-[0_0_0_4px_rgba(13,148,136,0.15)] dark:bg-teal-400 dark:border-teal-400'
                    : 'bg-card border-border-strong',
                )}
              />
              <h3 className="mt-5 text-lg font-medium text-fg">{t(`home.howItWorks.steps.${key}.title`)}</h3>
              <p className="mt-3 text-sm leading-6 text-fg-muted">{t(`home.howItWorks.steps.${key}.desc`)}</p>
            </li>
          );
        })}
      </ol>
    </HomeSection>
  );
}
