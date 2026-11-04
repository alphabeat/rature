import { Upload } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { PDF_INPUT_ID } from '@/components/home/DropZone.tsx';
import { Button } from '@/components/ui/button.tsx';
import { track } from '@/lib/analytics.ts';

// Last block before the footer. The button opens the hero drop zone's file picker, so the file
// goes through the same checks, events and model options.
export function ClosingCta() {
  const { t } = useTranslation();

  const openPicker = () => {
    track('closing-cta-clicked');
    document.getElementById(PDF_INPUT_ID)?.click();
  };

  return (
    <section aria-labelledby="closing-cta" className="w-full flex flex-col items-center gap-6 text-center">
      <h2 id="closing-cta" className="max-w-2xl text-3xl font-extrabold tracking-tight text-fg">{t('home.closing.title')}</h2>
      <p className="max-w-2xl text-base text-fg-muted leading-relaxed">{t('home.closing.definition')}</p>
      {/* The drop zone is desktop only, like this button. */}
      <Button type="button" size="lg" className="hidden md:inline-flex h-14 px-8 text-lg" onClick={openPicker}>
        <Upload size={20} aria-hidden="true" />
        {t('dropzone.choose')}
      </Button>
    </section>
  );
}
