import type { MetaArgs } from 'react-router';

import { pageMeta } from '@/lib/seo.ts';
import { PrivacyPolicyPage } from '@/pages/PrivacyPolicy.tsx';

export const meta = ({ location }: MetaArgs) => pageMeta(location.pathname);

export default PrivacyPolicyPage;
