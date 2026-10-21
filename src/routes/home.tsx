import type { MetaArgs } from 'react-router';

import { pageMeta } from '@/lib/seo.ts';
import { HomePage } from '@/pages/HomePage.tsx';

export const meta = ({ location }: MetaArgs) => pageMeta(location.pathname);

export default HomePage;
