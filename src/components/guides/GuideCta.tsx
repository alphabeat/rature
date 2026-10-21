import { useTranslation } from 'react-i18next';

import { DropZone } from '@/components/home/DropZone.tsx';
import { MobileSendLink } from '@/components/home/MobileSendLink.tsx';
import { useDropZoneHandlers } from '@/hooks/useDropZoneHandlers.ts';

// The home page's drop zone inside a guide: the reader usually arrives with a PDF in hand.
export function GuideCta() {
  const { t } = useTranslation();
  const { handleFileSelected, handleSampleSelected } = useDropZoneHandlers();

  return (
    <section className="flex flex-col gap-4 bg-card border border-border-theme shadow-sm p-6 dark:bg-surface-subtle dark:shadow-none">
      <p className="text-2xl font-extrabold tracking-tight text-fg">{t('guides.cta.title')}</p>
      <p className="text-base text-fg-muted leading-relaxed">{t('guides.cta.text')}</p>
      <div className="md:hidden">
        <MobileSendLink />
      </div>
      <div className="hidden md:block">
        <DropZone onFileSelect={handleFileSelected} onSampleSelect={handleSampleSelected} />
      </div>
    </section>
  );
}
