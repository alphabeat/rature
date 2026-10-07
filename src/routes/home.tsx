import { useCallback } from 'react';
import { useNavigate, type MetaArgs } from 'react-router';

import { pageMeta } from '@/lib/seo.ts';
import { HomePage } from '@/pages/HomePage.tsx';

export const meta = ({ location }: MetaArgs) => pageMeta(location.pathname);

export default function Home() {
  const navigate = useNavigate();
  const handleFileSelected = useCallback(() => navigate('/processing'), [navigate]);

  return <HomePage onFileSelect={handleFileSelected} />;
}
