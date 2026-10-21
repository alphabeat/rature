import { X } from 'lucide-react';
import { useState, useSyncExternalStore } from 'react';
import { Link, useLocation } from 'react-router';

import { track } from '@/lib/analytics.ts';
import i18n, { languageChosen, rememberLanguageChoice } from '@/lib/i18n.ts';
import { isGuidePath, localizedPath, publicPage, type Lang } from '@/lib/publicPages.ts';

const noopSubscribe = () => () => {};

// First of fr/en in the browser's preferences; English for everyone else.
function browserLang(): Lang {
  const langs = navigator.languages?.length ? navigator.languages : [navigator.language];
  const match = langs.find((l) => /^(fr|en)\b/i.test(l));
  return match?.toLowerCase().startsWith('fr') ? 'fr' : 'en';
}

// Public pages take their language from the URL. When the browser prefers the other one,
// suggest the counterpart page instead of redirecting.
export function LanguageSuggestion() {
  const { pathname } = useLocation();
  const page = publicPage(pathname);
  // False while prerendering and hydrating, so the banner never causes a mismatch.
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const [dismissed, setDismissed] = useState(false);

  if (!hydrated || !page || isGuidePath(page.path) || dismissed || languageChosen()) return null;
  const target = browserLang();
  if (target === page.lang) return null;

  const t = i18n.getFixedT(target);
  const choose = (action: 'switch' | 'dismiss') => {
    rememberLanguageChoice();
    track('language-suggestion', { action, to: target });
    setDismissed(true);
  };

  return (
    <div
      lang={target}
      role="region"
      aria-label={t('languageSuggestion.message')}
      className="fixed bottom-4 inset-x-4 z-50 mx-auto flex max-w-md items-center gap-3 border border-border-theme bg-surface/90 backdrop-blur-md px-4 py-3 text-sm text-fg shadow-lg"
    >
      <span className="flex-1">{t('languageSuggestion.message')}</span>
      <Link
        to={localizedPath(page.path, target)}
        hrefLang={target}
        onClick={() => choose('switch')}
        className="shrink-0 font-semibold text-accent underline-offset-4 hover:underline"
      >
        {t('languageSuggestion.switch')}
      </Link>
      <button
        type="button"
        onClick={() => choose('dismiss')}
        aria-label={t('languageSuggestion.dismiss')}
        className="shrink-0 cursor-pointer text-fg-muted hover:text-fg"
      >
        <X size={16} />
      </button>
    </div>
  );
}
