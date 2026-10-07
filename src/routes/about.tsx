import { pageMeta } from '@/lib/seo.ts';
import { AboutPage } from '@/pages/AboutPage.tsx';

export const meta = () => pageMeta({
  path: '/about',
  title: 'À propos | Rature, anonymisation de PDF dans le navigateur',
  description: 'Pourquoi Rature existe et comment il fonctionne : détection automatique des données sensibles, traitement 100% local dans le navigateur, code source ouvert.',
});

export default AboutPage;
