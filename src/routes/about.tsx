import type { MetaArgs } from 'react-router';

import { pageMeta } from '@/lib/seo.ts';
import { AboutPage } from '@/pages/AboutPage.tsx';

export const meta = ({ location }: MetaArgs) => pageMeta(location.pathname);

export default AboutPage;
