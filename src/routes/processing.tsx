import { useCallback } from 'react';
import { useNavigate } from 'react-router';

import { appMeta } from '@/lib/seo.ts';
import { LoadingPage } from '@/pages/LoadingPage.tsx';

export const meta = () => appMeta;

export default function Processing() {
  const navigate = useNavigate();
  const handleLoadingComplete = useCallback(() => navigate('/document/edition', { replace: true }), [navigate]);

  return <LoadingPage onComplete={handleLoadingComplete} />;
}
