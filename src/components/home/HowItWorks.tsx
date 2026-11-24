import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { HomeSection } from '@/components/home/HomeSection.tsx';
import { MiniSheet, type SheetState } from '@/components/home/MiniSheet.tsx';
import { cn } from '@/lib/utils.ts';

const STEPS = ['drop', 'review', 'export'] as const;

// The run, on a loop while the section is on screen: the rail fills from step to step and each
// page changes as it is reached, then it holds on the finished state before starting over.
// 0 = nothing yet, 4 = done (also the resting state for prerendered and reduced-motion visitors).
const DONE = 4;
const PHASE_AT_MS = [400, 1100, 1800, 2300];
const CYCLE_MS = 2300 + 2500; // last step, then the break

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

    let timers: number[] = [];
    const stop = () => {
      timers.forEach(clearTimeout);
      timers = [];
    };
    // One cycle: back to the empty page, the four steps, the break, then the next cycle.
    const run = () => {
      timers.push(window.setTimeout(() => setPhase(0), 0));
      PHASE_AT_MS.forEach((ms, i) => timers.push(window.setTimeout(() => setPhase(i + 1), ms)));
      timers.push(window.setTimeout(run, CYCLE_MS));
    };

    // Empty the steps before the section is reached (in a frame callback, off screen anyway).
    const reset = requestAnimationFrame(() => setPhase(0));
    // Runs only while on screen; scrolling away stops it, coming back starts a new cycle.
    const observer = new IntersectionObserver((entries) => {
      stop();
      if (entries.some(entry => entry.isIntersecting)) run();
    }, { threshold: 0.6 });
    observer.observe(list);
    return () => {
      cancelAnimationFrame(reset);
      observer.disconnect();
      stop();
    };
  }, []);

  const railFill = phase >= 2 ? 1 : phase >= 1 ? 0.5 : 0;

  return (
    <HomeSection id="how-it-works" title={t('home.howItWorks.title')}>
      <ol ref={listRef} className="relative w-full grid gap-12 md:gap-8 md:grid-cols-3">
        {/* The rail runs from the middle of the first column to the middle of the last: half a column in from each side. */}
        <div
          aria-hidden="true"
          className="hidden md:block absolute top-[142px] left-[calc((100%-4rem)/6)] right-[calc((100%-4rem)/6)] -translate-y-1/2"
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
            <li key={key} className="flex flex-col items-center text-center">
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
