import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';

import { appMeta } from '@/lib/seo.ts';
import { LoadingPage } from '@/pages/LoadingPage.tsx';

export const meta = () => appMeta;

export default function Processing() {
  const navigate = useNavigate();
  const [attempt, setAttempt] = useState(0);
  const handleLoadingComplete = useCallback(() => navigate('/document/edition', { replace: true }), [navigate]);
  const handleRetry = useCallback(() => setAttempt((n) => n + 1), []);

  // A new key remounts the page, so a retry starts from a fresh worker.
  return <LoadingPage key={attempt} onComplete={handleLoadingComplete} onRetry={handleRetry} />;
}
