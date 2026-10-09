import { useEffect, useState, type FormEvent } from 'react';
import { Check, CheckCircle, Sparkles } from 'lucide-react';
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
import { track } from '@/lib/analytics.ts';
import { cn } from '@/lib/utils.ts';
import { joinWaitlist, PROFESSIONS, WAITLIST_ENABLED, type Profession, type WaitlistSource } from '@/lib/waitlist.ts';

type Status = 'idle' | 'submitting' | 'done' | 'error';

const BENEFITS = ['batch', 'memory', 'private'] as const;

const inputClass = 'w-full rounded-xl border border-border-theme bg-surface-subtle px-3 py-2 text-sm text-fg placeholder:text-fg-muted focus:outline-none focus:border-accent/60 transition-colors';

interface ProWaitlistProps {
  source: WaitlistSource
  className?: string
}

// Opens the Rature Pro waitlist dialog: a card on the home page and after a download, a compact
// button in the navbar. Renders nothing when the waitlist is not configured.
export function ProWaitlist({ source, className }: ProWaitlistProps) {
  if (!WAITLIST_ENABLED) return null;
  return <ProWaitlistInner source={source} className={className} />;
}

function ProWaitlistInner({ source, className }: ProWaitlistProps) {
  const { t, i18n } = useTranslation();
  const localize = useLocalizedPath();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [profession, setProfession] = useState<Profession | ''>('');
  const [status, setStatus] = useState<Status>('idle');

  useEffect(() => {
    // The navbar button is on every public page, so its views would just mirror page views.
    if (source !== 'nav') track('waitlist-viewed', { source });
  }, [source]);

  const handleOpenChange = (next: boolean) => {
    if (next) {
      track('waitlist-opened', { source });
      setStatus('idle');
    }
    setOpen(next);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    const result = await joinWaitlist(email.trim(), profession, i18n.language === 'en' ? 'en' : 'fr');
    if (result.ok) {
      track('waitlist-submitted', { source });
      setEmail('');
      setProfession('');
      setStatus('done');
    } else {
      track('waitlist-failed', { source, reason: result.reason });
      setStatus('error');
    }
  };

  return (
    <>
      {source === 'nav' ? (
        <button
          type="button"
          onClick={() => handleOpenChange(true)}
          className={cn('flex items-center gap-2 px-3 py-2 shrink-0 border border-accent/50 bg-accent/10 text-sm font-semibold text-accent hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer', className)}
        >
          <Sparkles size={16} aria-hidden="true" />
          {t('waitlist.cta.nav')}
        </button>
      ) : (
        // On the home page the drop zone is the main CTA, so the card stays secondary there.
        <div
          className={cn(
            'relative w-full flex flex-col items-start gap-4 border px-5 py-4 text-left sm:flex-row sm:items-center',
            source === 'home' ? 'border-accent/40 bg-accent/5 dark:border-accent/50 dark:bg-accent/10' : 'border-accent/50 bg-card shadow-lg',
            className,
          )}
        >
          <div className="flex items-center justify-center w-10 h-10 shrink-0 rounded-full bg-accent/10 text-accent">
            <Sparkles size={20} aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="inline-block mb-1 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase whitespace-nowrap bg-accent/10 text-accent">
              {t('waitlist.cta.badgePaid')}
            </span>
            <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-medium tracking-wider uppercase whitespace-nowrap bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-300">
              {t('waitlist.cta.badgeSoon')}
            </span>
            <p className="text-base font-bold text-fg">{t('waitlist.cta.title')}</p>
            <p className="text-sm text-fg-muted">{t(`waitlist.cta.${source}`)}</p>
          </div>
          <Button
            variant={source === 'home' ? 'secondary' : 'primary'}
            onClick={() => handleOpenChange(true)}
            className={cn(
              'shrink-0 self-stretch sm:self-auto',
              source === 'home' && 'border-accent/50 bg-accent/10 text-accent hover:bg-accent hover:text-accent-foreground',
            )}
          >
            {t('waitlist.cta.action')}
          </Button>
        </div>
      )}

      <AlertDialog open={open} onOpenChange={handleOpenChange}>
        <AlertDialogContent className="max-w-md">
          {status === 'done' ? (
            <div className="flex flex-col items-center gap-3 text-center">
              <CheckCircle size={28} strokeWidth={1.5} className="text-accent" aria-hidden="true" />
              <AlertDialogTitle className="text-base">{t('waitlist.success.title')}</AlertDialogTitle>
              <AlertDialogDescription className="text-sm">{t('waitlist.success.desc')}</AlertDialogDescription>
              <AlertDialogCancel asChild>
                <Button variant="secondary" size="sm" className="mt-2">{t('waitlist.close')}</Button>
              </AlertDialogCancel>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <AlertDialogTitle className="text-base">{t('waitlist.title')}</AlertDialogTitle>
                <AlertDialogDescription className="text-sm">{t('waitlist.desc')}</AlertDialogDescription>
                <ul className="flex flex-col gap-1.5 text-sm text-fg-muted">
                  {BENEFITS.map(key => (
                    <li key={key} className="flex gap-2">
                      <Check size={16} className="text-accent shrink-0 mt-0.5" aria-hidden="true" />
                      <span><Trans i18nKey={`waitlist.benefits.${key}`} components={{ bold: <span className="font-semibold text-fg" /> }} /></span>
                    </li>
                  ))}
                </ul>
                <p className="text-sm font-medium text-accent">{t('waitlist.note')}</p>
              </div>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-fg">{t('waitlist.email')}</span>
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

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-fg">{t('waitlist.profession')}</span>
                <select
                  value={profession}
                  onChange={e => setProfession(e.target.value as Profession | '')}
                  className={cn(inputClass, 'cursor-pointer')}
                >
                  <option value="">{t('waitlist.professionPlaceholder')}</option>
                  {PROFESSIONS.map(p => (
                    <option key={p} value={p}>{t(`waitlist.professions.${p}`)}</option>
                  ))}
                </select>
              </label>

              <p className="text-xs text-fg-muted">
                <Trans
                  i18nKey="waitlist.consent"
                  components={{
                    // New tab: in the export flow, navigating away would lose the document.
                    privacyLink: <a href={localize('/privacy-policy')} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-fg" />,
                  }}
                />
              </p>

              {status === 'error' && (
                <p role="alert" className="text-xs text-red-600 dark:text-red-400">{t('waitlist.error')}</p>
              )}

              <div className="flex justify-end gap-2">
                <AlertDialogCancel asChild>
                  <Button type="button" variant="ghost" size="sm">{t('waitlist.cancel')}</Button>
                </AlertDialogCancel>
                <Button type="submit" size="sm" disabled={status === 'submitting'}>
                  {status === 'submitting' ? t('waitlist.submitting') : t('waitlist.submit')}
                </Button>
              </div>
            </form>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
