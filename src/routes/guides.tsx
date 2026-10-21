import type { MetaArgs } from 'react-router';

import { hubMeta } from '@/guides/meta.ts';
import { publicPage } from '@/lib/publicPages.ts';
import { GuidesHubPage } from '@/pages/GuidesHubPage.tsx';

export const meta = ({ location }: MetaArgs) => hubMeta(publicPage(location.pathname)?.lang ?? 'fr');

export default GuidesHubPage;
