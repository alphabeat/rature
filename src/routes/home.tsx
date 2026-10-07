import { useCallback } from 'react';
import { useNavigate } from 'react-router';

import { pageMeta } from '@/lib/seo.ts';
import { HomePage } from '@/pages/HomePage.tsx';

export const meta = () => pageMeta({
  path: '/',
  title: 'Rature | Anonymisation de PDF 100% locale et sécurisée',
  description: 'Anonymisez vos documents PDF directement dans votre navigateur, sans envoi de données. Rature protège vos informations confidentielles avant tout partage avec une IA.',
  ogTitle: 'Rature | Anonymisez vos PDF avant de les confier à une IA',
  ogDescription: 'Outil d\'anonymisation de documents PDF, 100% local. Aucune donnée ne quitte votre navigateur. Idéal pour juristes, DPO et avocats.',
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Rature',
    description: 'Outil d\'anonymisation de documents PDF fonctionnant 100% dans le navigateur. Aucune donnée ne quitte votre poste.',
    applicationCategory: 'SecurityApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
    audience: {
      '@type': 'Audience',
      audienceType: 'Juristes, DPO, Avocats, Professionnels de la conformité, Consultants',
    },
    featureList: [
      'Anonymisation de PDF 100% locale',
      'Aucun envoi de données vers un serveur',
      'Fonctionne dans le navigateur (WebAssembly/WebGPU)',
      'Compatible avec tout agent IA',
    ],
  },
});

export default function Home() {
  const navigate = useNavigate();
  const handleFileSelected = useCallback(() => navigate('/processing'), [navigate]);

  return <HomePage onFileSelect={handleFileSelected} />;
}
