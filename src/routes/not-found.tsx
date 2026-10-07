import { I18nextProvider, useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import { Navbar } from '@/components/Navbar.tsx';
import { publicPageI18n } from '@/lib/i18n.ts';
import { notFoundMeta } from '@/lib/seo.ts';

export const meta = () => notFoundMeta;

function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col flex-1 h-full">
      <Navbar />
      <main className="flex flex-col flex-1 items-center justify-center gap-4 px-6 pt-40 pb-16 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight">{t('notFound.title')}</h1>
        <p className="text-fg/80">{t('notFound.description')}</p>
        <Link to="/" className="underline underline-offset-4">{t('notFound.back')}</Link>
      </main>
    </div>
  );
}

// Prerendered once as `404.html` (French) and served by nginx for every unknown URL, so it
// renders with the fixed French instance to hydrate the same way for every visitor.
export default function NotFoundRoute() {
  return (
    <I18nextProvider i18n={publicPageI18n.fr}>
      <NotFound />
    </I18nextProvider>
  );
}
