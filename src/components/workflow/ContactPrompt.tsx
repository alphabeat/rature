import { MessageCircle } from 'lucide-react';
import { Trans, useTranslation } from 'react-i18next';
import { track } from '@/lib/analytics.ts';
import { CONTACT_CALL_URL, CONTACT_EMAIL } from '@/lib/contactPrompt.ts';

interface ContactPromptProps {
  onContact: () => void
}

// Shown once, after a download, to users who have downloaded 2 or more documents: asks for a
// 20-minute call or an email to recruit Pro interviews. The parent tracks dismissal on close.
export function ContactPrompt({ onContact }: ContactPromptProps) {
  const { t } = useTranslation();

  const handleClick = (method: 'call' | 'email') => () => {
    track('contact-prompt-clicked', { method });
    onContact();
  };

  const linkClass = 'font-semibold text-accent underline underline-offset-4 hover:text-fg';

  return (
    <div className="w-full flex items-start gap-3 rounded-xl border border-accent/50 bg-card shadow-lg px-5 py-4 mt-2 text-left">
      <MessageCircle size={20} className="text-accent shrink-0 mt-0.5" aria-hidden="true" />
      <p className="text-sm text-fg">
        <Trans
          i18nKey="contactPrompt.text"
          values={{ email: CONTACT_EMAIL }}
          components={{
            // New tab: navigating away would lose the document.
            call: <a href={CONTACT_CALL_URL} target="_blank" rel="noopener noreferrer" onClick={handleClick('call')} className={linkClass} />,
            email: <a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(t('contactPrompt.emailSubject'))}`} onClick={handleClick('email')} className={linkClass} />,
          }}
        />
      </p>
    </div>
  );
}
