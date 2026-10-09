import { Monitor, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button.tsx';
import { useLocalizedPath } from '@/hooks/useLocalizedPath.ts';
import { track } from '@/lib/analytics.ts';
import { SITE_URL } from '@/lib/publicPages.ts';

// Shown below `md` in place of the drop zone: the model and the review need a computer.
export function MobileSendLink() {
  const { t } = useTranslation();
  const localize = useLocalizedPath();

  const sendLink = async () => {
    const url = new URL(localize('/'), SITE_URL).href;
    const title = t('home.mobileLink.shareTitle');
    const text = t('home.mobileLink.shareText');

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        track('mobile-link-shared', { method: 'share' });
        return;
      } catch (error) {
        // The user closed the share sheet; any other failure falls back to email.
        if ((error as DOMException).name === 'AbortError') return;
      }
    }

    const body = `${text}\n\n${url}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
    track('mobile-link-shared', { method: 'mailto' });
  };

  return (
    <div className="flex flex-col items-center gap-4 text-center border-2 border-dashed border-border-strong px-6 py-6">
      <Monitor size={28} className="text-accent shrink-0" aria-hidden="true" />
      <p className="font-extrabold text-lg text-fg">{t('home.mobileLink.title')}</p>
      <p className="text-sm text-fg-muted leading-relaxed">{t('home.mobileLink.desc')}</p>
      <Button type="button" size="lg" className="h-auto min-h-14 px-6 py-3 text-base whitespace-normal" onClick={sendLink}>
        <Send size={20} aria-hidden="true" />
        {t('home.mobileLink.button')}
      </Button>
    </div>
  );
}
