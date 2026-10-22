import { Trans, useTranslation } from "react-i18next";
import { Link } from "react-router";

import { Footer } from "@/components/home/Footer.tsx";
import { Navbar } from "@/components/Navbar.tsx";
import { useLocalizedPath } from "@/hooks/useLocalizedPath.ts";
import { AUTHOR_LINKEDIN_URL } from "@/lib/author.ts";

const bold = <span className="font-bold" />;
const hostLink = <a href="https://www.ovhcloud.com/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4" />;
const mailLink = <a href="mailto:contact@rature.fr" className="underline underline-offset-4" />;

export function LegalNoticePage() {
  const { t } = useTranslation();
  const localize = useLocalizedPath();
  const components = {
    bold,
    hostLink,
    mailLink,
    authorLink: <a href={AUTHOR_LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4" />,
    privacyLink: <Link to={localize('/privacy-policy')} className="underline underline-offset-4" />,
  };

  return (
    <div className="flex flex-col justify-between flex-1 h-full">
      <Navbar />

      <section className="flex-1 mx-auto h-full w-full max-w-200 px-6 pt-40 pb-16">
        <h1 className="flex items-baseline justify-center gap-3 text-center text-4xl font-extrabold tracking-tight leading-[1.1] mb-8">
          {t('legal.title')}
        </h1>
        <p className="mb-6 text-fg-muted">{t('legal.lastUpdated')}</p>

        <h3 className="font-bold text-2xl mb-2">{t('legal.publisher.title')}</h3>
        <div className="flex flex-col gap-2 mb-6 pl-4">
          <p><Trans i18nKey="legal.publisher.p1" components={components} /></p>
          <p><Trans i18nKey="legal.publisher.contact" components={components} /></p>
        </div>

        <h3 className="font-bold text-2xl mb-2">{t('legal.host.title')}</h3>
        <div className="flex flex-col gap-2 mb-6 pl-4">
          <p>
            <Trans i18nKey="legal.host.provider" components={components} />
            <br />
            {t('legal.host.address')}
            <br />
            {t('legal.host.phone')}
            <br />
            <Trans i18nKey="legal.host.website" components={components} />
          </p>
        </div>

        <h3 className="font-bold text-2xl mb-2">{t('legal.data.title')}</h3>
        <div className="flex flex-col gap-2 mb-6 pl-4">
          <p><Trans i18nKey="legal.data.p1" components={components} /></p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
