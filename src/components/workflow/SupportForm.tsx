import { useState, type FormEvent } from 'react';
import { CheckCircle, MessageCircle } from 'lucide-react';
import { Trans, useTranslation } from 'react-i18next';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog.tsx';
import { Button } from '@/components/ui/button.tsx';
import { useLocalizedPath } from '@/hooks/useLocalizedPath.ts';
import { pagesBucket, track } from '@/lib/analytics.ts';
import { sendSupportMessage, SUPPORT_ENABLED, SUPPORT_MESSAGE_MAX, type SupportKind } from '@/lib/support.ts';

type Status = 'idle' | 'submitting' | 'done' | 'error';

const inputClass = 'w-full rounded-xl border border-border-theme bg-surface-subtle px-3 py-2 text-sm text-fg placeholder:text-fg-muted focus:outline-none focus:border-accent/60 transition-colors';

interface SupportFormProps {
  kind: SupportKind
  stage: string
  pageCount: number
}

// "Tell me what happened" link on the stall notice and the analysis error screen. Opens a short
// form whose message reaches Julien by email through Brevo. Renders nothing when not configured.
export function SupportForm(props: SupportFormProps) {
  if (!SUPPORT_ENABLED) return null;
  return <SupportFormInner {...props} />;
}

function SupportFormInner({ kind, stage, pageCount }: SupportFormProps) {
  const { t, i18n } = useTranslation();
  const localize = useLocalizedPath();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  const handleOpenChange = (next: boolean) => {
    if (next) {
      track('support-opened', { kind, stage });
      if (status !== 'done') setStatus('idle');
    }
    setOpen(next);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    const result = await sendSupportMessage(
      email.trim(),
      message.trim(),
      { kind, stage, pages: pagesBucket(pageCount) },
      i18n.language === 'en' ? 'en' : 'fr',
    );
    if (result.ok) {
      track('support-submitted', { kind, stage });
      setMessage('');
      setStatus('done');
    } else {
      track('support-failed', { kind, stage, reason: result.reason });
      setStatus('error');
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => handleOpenChange(true)}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-accent underline underline-offset-4 hover:text-fg cursor-pointer"
      >
        <MessageCircle size={14} aria-hidden="true" />
        {t('support.link')}
      </button>

      <AlertDialog open={open} onOpenChange={handleOpenChange}>
        <AlertDialogContent className="max-w-md">
          {status === 'done' ? (
            <div className="flex flex-col items-center gap-3 text-center">
              <CheckCircle size={28} strokeWidth={1.5} className="text-accent" aria-hidden="true" />
              <AlertDialogTitle className="text-base">{t('support.success.title')}</AlertDialogTitle>
              <AlertDialogDescription className="text-sm">{t('support.success.desc')}</AlertDialogDescription>
              <AlertDialogCancel asChild>
                <Button variant="secondary" size="sm" className="mt-2">{t('support.close')}</Button>
              </AlertDialogCancel>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <AlertDialogTitle className="text-base">{t('support.title')}</AlertDialogTitle>
                <AlertDialogDescription className="text-sm">{t('support.desc')}</AlertDialogDescription>
              </div>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-fg">{t('support.message')}</span>
                <textarea
                  required
                  rows={4}
                  maxLength={SUPPORT_MESSAGE_MAX}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder={t('support.messagePlaceholder')}
                  className={`${inputClass} resize-none`}
                />
                <span className="text-xs text-fg-muted">{t('support.noContent')}</span>
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-fg">{t('support.email')}</span>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={t('waitlist.emailPlaceholder')}
                  className={inputClass}
                />
              </label>

              <p className="text-xs text-fg-muted">
                <Trans
                  i18nKey="support.consent"
                  components={{
                    // New tab: navigating away would lose the document.
                    privacyLink: <a href={localize('/privacy-policy')} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-fg" />,
                  }}
                />
              </p>

              {status === 'error' && (
                <p role="alert" className="text-xs text-red-600 dark:text-red-400">{t('support.error')}</p>
              )}

              <div className="flex justify-end gap-2">
                <AlertDialogCancel asChild>
                  <Button type="button" variant="ghost" size="sm">{t('support.cancel')}</Button>
                </AlertDialogCancel>
                <Button type="submit" size="sm" disabled={status === 'submitting'}>
                  {status === 'submitting' ? t('support.submitting') : t('support.submit')}
                </Button>
              </div>
            </form>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
