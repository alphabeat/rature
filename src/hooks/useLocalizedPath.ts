import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { localizedPath } from '@/lib/publicPages.ts';

// Maps a public path to the current language (`/about` -> `/en/about`); app paths are unchanged.
export function useLocalizedPath() {
  const { i18n } = useTranslation();
  const lang = i18n.language === 'en' ? 'en' : 'fr';

  return useCallback((path: string) => localizedPath(path, lang), [lang]);
}
