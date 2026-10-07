import { pageMeta } from '@/lib/seo.ts';
import { PrivacyPolicyPage } from '@/pages/PrivacyPolicy.tsx';

export const meta = () => pageMeta({
  path: '/privacy-policy',
  title: 'Politique de confidentialité | Rature',
  description: 'Rature traite vos documents uniquement dans votre navigateur : aucun fichier n\'est envoyé. Détail de la mesure d\'audience anonyme et de vos droits.',
});

export default PrivacyPolicyPage;
