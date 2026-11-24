import { ArrowRight, Check, FileText, UserRound } from 'lucide-react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { HomeSection } from '@/components/home/HomeSection.tsx';
import { MiniSheet } from '@/components/home/MiniSheet.tsx';

const USE_CASES = ['ai', 'share', 'gdpr', 'publish'] as const;
type UseCase = (typeof USE_CASES)[number];

// A line of a page drawn in code: grey text with black redaction bars.
function RedactedLine({ parts }: { parts: [width: string, redacted?: boolean][] }) {
  return (
    <div className="flex items-center gap-0.5">
      {parts.map(([width, redacted], i) => (
        <span key={i} className={redacted ? 'block h-1.5 bg-neutral-900 dark:bg-neutral-100' : 'block h-0.5 bg-border-strong'} style={{ width }} />
      ))}
    </div>
  );
}

// An assistant chat: the redacted PDF goes in, an answer comes out.
function Chat() {
  return (
    <div className="w-36 flex flex-col gap-2 bg-card border border-border-theme p-3 shadow-[0_8px_24px_rgba(0,0,0,0.06)] dark:shadow-none">
      <div className="self-end flex items-center gap-1.5 bg-teal-600 px-2 py-1.5 rounded-[6px]">
        <FileText size={12} strokeWidth={1.5} className="text-white" />
        <span className="block w-10 h-1 bg-white/70" />
      </div>
      <div className="self-start w-28 flex flex-col gap-1.5 bg-surface-subtle px-2 py-2 rounded-[6px]">
        <span className="block h-1 w-full bg-fg-subtle/50" />
        <span className="block h-1 w-5/6 bg-fg-subtle/50" />
        <span className="block h-1 w-2/3 bg-fg-subtle/50" />
      </div>
    </div>
  );
}

// A sealed envelope on its way to a colleague or an expert.
function Envelope() {
  return (
    <div className="relative">
      <svg viewBox="0 0 96 64" className="w-28 h-[75px] drop-shadow-[0_8px_16px_rgba(0,0,0,0.08)]">
        <rect x="0.5" y="0.5" width="95" height="63" fill="#fdfcf9" stroke="rgba(0,0,0,0.1)" />
        <path d="M1 1 L48 38 L95 1" fill="none" stroke="#a3a3a3" strokeWidth="1.5" />
      </svg>
      <span className="absolute -right-2 -bottom-2 flex items-center justify-center w-6 h-6 rounded-full bg-teal-600 text-white">
        <Check size={14} strokeWidth={2} />
      </span>
    </div>
  );
}

// The person who asked for their data: their own name stays, everyone else's is removed.
function Requester() {
  return (
    <div className="w-28 flex flex-col items-center gap-3 bg-card border border-border-theme px-3 py-4 shadow-[0_8px_24px_rgba(0,0,0,0.06)] dark:shadow-none">
      <span className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-400/20 dark:text-blue-300">
        <UserRound size={18} strokeWidth={1.5} />
      </span>
      <span className="block h-2 w-16 bg-blue-300" />
    </div>
  );
}

// A published web page with the parties removed.
function WebPage() {
  return (
    <div className="w-40 bg-card border border-border-theme shadow-[0_8px_24px_rgba(0,0,0,0.06)] dark:shadow-none">
      <div className="flex items-center gap-1 h-5 px-2 border-b border-border-theme">
        <span className="w-1.5 h-1.5 rounded-full bg-border-strong" />
        <span className="w-1.5 h-1.5 rounded-full bg-border-strong" />
        <span className="w-1.5 h-1.5 rounded-full bg-border-strong" />
      </div>
      <div className="flex flex-col gap-2 p-3">
        <span className="block h-1.5 w-1/2 bg-fg/70" />
        <RedactedLine parts={[['28%'], ['26%', true], ['30%']]} />
        <RedactedLine parts={[['86%']]} />
        <RedactedLine parts={[['18%'], ['40%', true], ['24%']]} />
        <RedactedLine parts={[['72%']]} />
      </div>
    </div>
  );
}

// Every case reads the same way: the redacted page, then where it goes.
const SCENES: Record<UseCase, ReactNode> = {
  ai: <Chat />,
  share: <Envelope />,
  gdpr: <Requester />,
  publish: <WebPage />,
};

export function UseCases() {
  const { t } = useTranslation();

  return (
    <HomeSection id="use-cases" title={t('home.useCases.title')}>
      <ul className="w-full grid gap-6 md:grid-cols-2">
        {USE_CASES.map(key => (
          <li key={key} className="flex flex-col bg-card border border-border-theme">
            <div
              aria-hidden="true"
              className="h-48 flex items-center justify-center gap-5 bg-teal-50/70 border-b border-border-theme dark:bg-teal-950/30"
            >
              <MiniSheet state="redacted" size="sm" keep={key === 'gdpr' ? 'per' : undefined} />
              <ArrowRight size={18} strokeWidth={1.5} className="shrink-0 text-teal-600 dark:text-teal-400" />
              {SCENES[key]}
            </div>
            <div className="flex flex-col gap-2 p-6">
              <h3 className="text-base font-medium text-fg">{t(`home.useCases.items.${key}.title`)}</h3>
              <p className="text-sm leading-6 text-fg-muted">{t(`home.useCases.items.${key}.desc`)}</p>
            </div>
          </li>
        ))}
      </ul>
    </HomeSection>
  );
}
