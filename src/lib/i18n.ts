import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import fr from '@/locales/fr/translation.json' with { type: 'json' };
import en from '@/locales/en/translation.json' with { type: 'json' };

// Always start in French so the client matches the prerendered HTML; root.tsx applies
// a stored choice after hydration.
i18n
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: fr },
      en: { translation: en },
    },
    lng: 'fr',
    fallbackLng: 'fr',
    supportedLngs: ['fr', 'en'],
    interpolation: {
      escapeValue: false,
    },
  });

i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
  try {
    localStorage.setItem('rature-language', lng);
  } catch {
    // storage unavailable: the choice lasts for this page only
  }
});

export default i18n;
