import { useLocation, type MetaArgs } from 'react-router';

import { findGuide } from '@/guides/index.ts';
import { guideMeta } from '@/guides/meta.ts';
import { notFoundMeta } from '@/lib/seo.ts';
import { GuidePage } from '@/pages/GuidePage.tsx';
import NotFoundRoute from '@/routes/not-found.tsx';

// `:slug` also matches unknown guides, which get the splat route's 404 page.
export const meta = ({ location }: MetaArgs) => {
  const guide = findGuide(location.pathname);
  return guide ? guideMeta(guide) : notFoundMeta;
};

export default function Guide() {
  const { pathname } = useLocation();
  const guide = findGuide(pathname);

  return guide ? <GuidePage guide={guide} /> : <NotFoundRoute />;
}
