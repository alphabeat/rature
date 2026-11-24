import { useState } from 'react';
import { ArrowRight, Loader2, Upload } from 'lucide-react';
import { Trans, useTranslation } from 'react-i18next';

import { PDF_INPUT_ID } from '@/components/home/DropZone.tsx';
import { MiniSheet } from '@/components/home/MiniSheet.tsx';
import { Button } from '@/components/ui/button.tsx';
import { track } from '@/lib/analytics.ts';

interface ClosingCtaProps {
  onSampleSelect: () => Promise<void>;
}

// Last block before the footer. The button opens the hero drop zone's file picker, so the file
// goes through the same checks, events and model options.
export function ClosingCta({ onSampleSelect }: ClosingCtaProps) {
  const { t } = useTranslation();
  const [isSampleLoading, setIsSampleLoading] = useState(false);

  const openPicker = () => {
    track('closing-cta-clicked');
    document.getElementById(PDF_INPUT_ID)?.click();
  };

  const openSample = async () => {
    if (isSampleLoading) return;
    track('closing-sample-clicked');
    setIsSampleLoading(true);
    await onSampleSelect();
    setIsSampleLoading(false);
  };

  return (
    <section
      aria-labelledby="closing-cta"
      className="home-band border w-full grid gap-12 items-center px-6 py-16 sm:px-12 md:py-20 lg:grid-cols-[1fr_auto] lg:px-16"
    >
      <div className="flex flex-col items-start gap-6">
        <h2 id="closing-cta" className="text-3xl sm:text-4xl leading-tight font-medium tracking-[-0.02em] text-fg">
          <Trans i18nKey="home.closing.title" components={{ br: <br /> }} />
        </h2>
        <p className="max-w-xl text-base leading-7 text-fg-muted">{t('home.closing.definition')}</p>
        {/* The drop zone is desktop only, like these buttons. */}
        <div className="hidden md:flex items-center gap-3">
          <Button type="button" size="lg" className="h-12 px-6 text-base" onClick={openPicker}>
            <Upload size={18} strokeWidth={1.5} aria-hidden="true" />
            {t('dropzone.choose')}
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="lg"
            className="h-12 px-6 text-base bg-card"
            onClick={openSample}
            disabled={isSampleLoading}
          >
            {isSampleLoading && <Loader2 size={18} className="animate-spin" aria-hidden="true" />}
            {t('dropzone.sample')}
          </Button>
        </div>
      </div>

      {/* The page before and after: what the two buttons lead to. */}
      <div aria-hidden="true" className="flex items-center gap-5 justify-self-center">
        <MiniSheet state="detected" style={{ transform: 'rotate(-2deg)' }} />
        <ArrowRight size={20} strokeWidth={1.5} className="shrink-0 text-teal-600 dark:text-teal-400" />
        <MiniSheet state="redacted" style={{ transform: 'rotate(2deg)' }} />
      </div>
    </section>
  );
}
