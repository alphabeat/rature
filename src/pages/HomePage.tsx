import { Code2, CloudOff, Gift, MapPin } from 'lucide-react';
import type { ReactNode } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { BeforeAfter } from '@/components/home/BeforeAfter.tsx';
import { ClosingCta } from '@/components/home/ClosingCta.tsx';
import { DropZone } from '@/components/home/DropZone.tsx';
import { Faq } from '@/components/home/Faq.tsx';
import { Footer } from '@/components/home/Footer.tsx';
import { HomeGuides } from '@/components/home/HomeGuides.tsx';
import { HowItWorks } from '@/components/home/HowItWorks.tsx';
import { MobileSendLink } from '@/components/home/MobileSendLink.tsx';
import { UseCases } from '@/components/home/UseCases.tsx';
import { VerifySteps } from '@/components/home/VerifySteps.tsx';
import { Navbar } from '@/components/Navbar.tsx';
import { ProWaitlist } from '@/components/ProWaitlist.tsx';
import { useDropZoneHandlers } from '@/hooks/useDropZoneHandlers.ts';
import { REPO_URL } from '@/lib/author.ts';

const TRUST = [
  { icon: CloudOff, key: 'home.trust.noUpload' },
  { icon: Gift, key: 'home.trust.free' },
  { icon: Code2, key: 'home.trust.openSource', href: REPO_URL },
  { icon: MapPin, key: 'home.trust.madeInFrance' },
] as const;

// The description's tags: the product name and the promise read as plain text in the primary
// color, and the line breaks flow as spaces so the paragraph wraps to its column.
const Name = () => <span className="text-fg">Rature</span>;
const Space = () => ' ';

// The kinds of data Rature finds, marked in their review colors as the hero sheet detects them.
const MARKS = {
  per: 'bg-blue-200/70 border-blue-400 dark:bg-blue-400/20',
  loc: 'bg-green-200/70 border-green-500 dark:bg-green-400/20 dark:border-green-400',
  email: 'bg-amber-200/70 border-amber-400 dark:bg-amber-400/20',
  phone: 'bg-red-200/70 border-red-400 dark:bg-red-400/20',
} as const;

function Mark({ kind, order, children }: { kind: keyof typeof MARKS; order: number; children?: ReactNode }) {
  return (
    <span
      className={`word-mark-in px-0.5 border-b-2 text-fg ${MARKS[kind]}`}
      style={{ animationDelay: `${500 + order * 160}ms` }}
    >
      {children}
    </span>
  );
}

export function HomePage() {
  const { t } = useTranslation();
  const { handleFileSelected, handleSampleSelected } = useDropZoneHandlers();

  return (
    <div className="home-page flex flex-col min-h-full">
      <Navbar />

      <section className="mx-auto w-full max-w-6xl px-6 pt-32 pb-16 tall:pt-40 tall:pb-24 grid gap-12 items-center lg:grid-cols-[1fr_auto]">
        <div className="flex flex-col gap-6">
          <h1
            className="rise-in text-4xl sm:text-5xl lg:text-[56px] leading-[1.05] font-semibold tracking-[-0.02em] lg:tracking-[-0.03em]"
          >
            <span className="block text-fg">{t('home.title')}</span>{' '}
            <span className="block text-teal-700 dark:text-teal-300">{t('home.subtitle')}</span>
          </h1>

          <p className="rise-in max-w-xl text-lg leading-8 text-fg-muted" style={{ animationDelay: '60ms' }}>
            <Trans
              i18nKey="home.description"
              components={{
                logo: <Name />,
                bold: <span className="text-fg" />,
                accent: <span className="text-fg" />,
                br: <Space />,
                per: <Mark kind="per" order={0} />,
                loc: <Mark kind="loc" order={1} />,
                email: <Mark kind="email" order={2} />,
                phone: <Mark kind="phone" order={3} />,
              }}
            />
          </p>

          <ul
            className="rise-in grid sm:grid-cols-[auto_auto] sm:justify-start gap-x-8 gap-y-2 text-sm text-fg-muted"
            style={{ animationDelay: '120ms' }}
          >
            {TRUST.map(item => {
              const Icon = item.icon;
              const content = (
                <>
                  <Icon size={16} strokeWidth={1.5} className="shrink-0 text-teal-700 dark:text-teal-400" aria-hidden="true" />
                  {t(item.key)}
                </>
              );
              return (
                <li key={item.key} className="flex items-center gap-2">
                  {'href' in item ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 underline decoration-border-strong underline-offset-4 hover:text-fg transition-colors"
                    >
                      {content}
                    </a>
                  ) : content}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="w-full max-w-xl bg-card md:hidden">
          <MobileSendLink />
        </div>

        <div
          className="rise-in hidden md:block w-full max-w-xl lg:w-md bg-card shadow-[0_8px_24px_rgba(13,148,136,0.08)] dark:shadow-none"
          style={{ animationDelay: '60ms' }}
        >
          <DropZone onFileSelect={handleFileSelected} onSampleSelect={handleSampleSelected} />
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl px-6 pt-20 pb-24 flex flex-col gap-24">
        <HowItWorks />
        <BeforeAfter />
        <VerifySteps />
        <UseCases />
        <HomeGuides />
        <Faq />
        {/* Below the proof and the FAQ: the free tool comes first. */}
        <ProWaitlist source="home" />
        <ClosingCta onSampleSelect={handleSampleSelected} />
      </div>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}
