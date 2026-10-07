import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import fr from '@/locales/fr/translation.json' with { type: 'json' };
import en from '@/locales/en/translation.json' with { type: 'json' };
import { publicPage, type Lang } from '@/lib/publicPages.ts';

function storedLang(): Lang {
  try {
    return localStorage.getItem('rature-language') === 'en' ? 'en' : 'fr';
  } catch {
    return 'fr';
  }
}

// Public pages take their language from the URL, app pages from the stored choice.
function initialLang(): Lang {
  if (typeof window === 'undefined') return 'fr';
  return publicPage(window.location.pathname)?.lang ?? storedLang();
}

i18n
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: fr },
      en: { translation: en },
    },
    lng: initialLang(),
    fallbackLng: 'fr',
    supportedLngs: ['fr', 'en'],
    interpolation: {
      escapeValue: false,
    },
  });

i18n.on('languageChanged', (lng) => {
  try {
    localStorage.setItem('rature-language', lng);
  } catch {
    // storage unavailable: the choice lasts for this page only
  }
});

// Fixed-language instances for public pages, so each prerendered URL renders in its own
// language regardless of the shared instance. Resources are shared and loaded synchronously.
export const publicPageI18n: Record<Lang, typeof i18n> = {
  fr: i18n.cloneInstance({ lng: 'fr' }),
  en: i18n.cloneInstance({ lng: 'en' }),
};

export default i18n;
