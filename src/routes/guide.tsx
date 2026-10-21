import { useLocation, type MetaArgs } from 'react-router';

import { findGuide } from '@/guides/index.ts';
import { guideMeta } from '@/guides/meta.ts';
import { notFoundMeta } from '@/lib/seo.ts';
import { GuidePage } from '@/pages/GuidePage.tsx';
import NotFoundRoute from '@/routes/not-found.tsx';

// `:slug` also matches unknown guides, which get the splat route's 404 page.
export const meta = ({ location }: MetaArgs) => {
  const found = findGuide(location.pathname);
  return found ? guideMeta(found.guide, found.lang) : notFoundMeta;
};

export default function Guide() {
  const { pathname } = useLocation();
  const found = findGuide(pathname);

  return found ? <GuidePage guide={found.guide} lang={found.lang} /> : <NotFoundRoute />;
}
