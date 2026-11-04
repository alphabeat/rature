import { useTranslation } from 'react-i18next';

import { GuideCard } from '@/components/guides/GuideCard.tsx';
import { HomeSection } from '@/components/home/HomeSection.tsx';
import { GUIDES } from '@/guides/index.ts';

// Links every guide from the home page, with the guide titles as anchors.
export function HomeGuides() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === 'en' ? 'en' : 'fr';

  return (
    <HomeSection id="guides" title={t('home.guides.title')} intro={t('home.guides.intro')}>
      <ul className="w-full grid gap-6 md:grid-cols-3">
        {GUIDES[lang].map((guide) => <GuideCard key={guide.path} guide={guide} />)}
      </ul>
    </HomeSection>
  );
}
