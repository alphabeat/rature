import type { MetaArgs } from 'react-router';

import { pageMeta } from '@/lib/seo.ts';
import { LegalNoticePage } from '@/pages/LegalNotice.tsx';

export const meta = ({ location }: MetaArgs) => pageMeta(location.pathname);

export default LegalNoticePage;
