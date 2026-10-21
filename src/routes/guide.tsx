import { useLocation, type MetaArgs } from 'react-router';

import { GUIDES } from '@/guides/index.ts';
import { guideMeta } from '@/guides/meta.ts';
import { GuidePage } from '@/pages/GuidePage.tsx';

function guideAt(pathname: string) {
  return GUIDES.find((g) => g.path === pathname.replace(/\/+$/, ''));
}

export const meta = ({ location }: MetaArgs) => {
  const guide = guideAt(location.pathname);
  return guide ? guideMeta(guide) : [];
};

export default function Guide() {
  const { pathname } = useLocation();
  const guide = guideAt(pathname);
  if (!guide) throw new Response('Not Found', { status: 404 });

  return <GuidePage guide={guide} />;
}
