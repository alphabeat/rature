import { useEffect, type ReactNode } from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration, useLocation, useRouteError } from 'react-router';
import './index.css';
import i18n, { publicPageI18n } from '@/lib/i18n.ts';
import { publicPage } from '@/lib/publicPages.ts';

import { appMeta } from '@/lib/seo.ts';
import Providers from '@/providers/index.tsx';

// Runs before paint so prerendered pages don't flash light for dark-mode users.
const THEME_SCRIPT = `try{var t=localStorage.getItem('rature-theme');if(t!=='dark'&&t!=='light')t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';if(t==='dark')document.documentElement.classList.add('dark')}catch(e){}`;

const UMAMI_BEFORE_SEND = `window.umamiBeforeSend=function(type,payload){var n=navigator,b=n.userAgentData&&n.userAgentData.brands;if(n.webdriver===true||(b&&b.some(function(x){return /Headless/i.test(x.brand);})))return null;return payload;};`;

export const meta = () => appMeta;

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const { i18n: appI18n } = useTranslation();
  const lang = publicPage(pathname)?.lang ?? appI18n.language;

  // Hydration keeps the prerendered attribute (the SPA fallback is always `fr`), so sync it.
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <Meta />
        <Links />
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <script dangerouslySetInnerHTML={{ __html: UMAMI_BEFORE_SEND }} />
        <script
          defer
          src="https://umami.julienkilo.dev/script.js"
          data-website-id="39520de9-59ed-482b-80ad-bc208c863614"
          data-before-send="umamiBeforeSend"
          data-domains="rature.fr"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <div id="root">{children}</div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const { pathname } = useLocation();
  const pageLang = publicPage(pathname)?.lang;

  // A public page's language carries over to the app pages opened from it.
  useEffect(() => {
    if (pageLang) void i18n.changeLanguage(pageLang);
  }, [pageLang]);

  return (
    <I18nextProvider i18n={pageLang ? publicPageI18n[pageLang] : i18n}>
      <Providers>
        <div className="flex flex-col min-h-full text-fg antialiased bg-linear-to-b from-gray-200 to-surface dark:from-surface dark:to-gray-900">
          <Outlet />
        </div>
      </Providers>
    </I18nextProvider>
  );
}

export function HydrateFallback() {
  return null;
}

export function ErrorBoundary() {
  const error = useRouteError();
  const notFound = isRouteErrorResponse(error) && error.status === 404;

  return (
    <main className="flex flex-col items-center justify-center gap-4 h-full p-8 text-center">
      <h1 className="text-2xl font-bold">{notFound ? 'Page introuvable' : 'Une erreur est survenue'}</h1>
      <a href="/" className="underline underline-offset-4">Retour à l'accueil</a>
    </main>
  );
}
