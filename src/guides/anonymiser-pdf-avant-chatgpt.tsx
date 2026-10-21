import { Figure, P, Stats, Steps, Table, Ul } from '@/components/guides/GuideBlocks.tsx';
import { GuideCta } from '@/components/guides/GuideCta.tsx';
import type { Guide, GuideStep } from '@/guides/types.ts';

const steps: GuideStep[] = [
  {
    title: 'Ouvrez le PDF dans Rature.',
    text: 'Déposez le fichier sur la [page d\'accueil](/). Il est lu dans votre navigateur et n\'est envoyé nulle part. Au premier usage, le modèle de détection (environ 400 Mo) est téléchargé une fois, puis gardé en cache.',
  },
  {
    title: 'Laissez la détection repérer les données.',
    text: 'Un modèle d\'IA entraîné sur le français repère les noms, sociétés, adresses, emails, téléphones, IBAN et autres identifiants. Chaque détection est surlignée dans le document.',
  },
  {
    title: 'Relisez et corrigez.',
    text: 'Retirez ce qui ne doit pas être masqué, ajoutez ce qui manque : une fonction, une date, une référence de dossier. Quand vous sélectionnez un nom, toutes ses occurrences dans le document sont retirées.',
  },
  {
    title: 'Traitez les images.',
    text: 'Dans l\'édition des images, occultez les logos, signatures et tampons. Un logo qui revient sur chaque page se traite en une fois.',
  },
  {
    title: 'Exportez, puis vérifiez.',
    text: 'L\'export remplace chaque donnée par un bloc « [OCCULTÉ] », retire le texte du fichier et supprime les métadonnées. Faites ensuite un copier-coller de tout le texte : rien de masqué ne doit réapparaître ([voir les 5 tests](/guides/verifier-caviardage-pdf)).',
  },
];

export const anonymiserPdfAvantChatgpt: Guide = {
  path: '/guides/anonymiser-pdf-avant-chatgpt',
  title: 'Anonymiser un PDF avant ChatGPT en 5 étapes | Rature',
  description: 'Retirez noms, adresses et IBAN d\'un PDF avant de le donner à ChatGPT, sans l\'envoyer sur un serveur. 5 étapes testées, avec les règles du CNB et de la CNIL.',
  ogTitle: 'Anonymiser un PDF avant de le donner à ChatGPT',
  heading: 'Comment anonymiser un PDF avant de le donner à ChatGPT ?',
  breadcrumb: 'Anonymiser un PDF avant ChatGPT',
  readingTime: 6,
  card: {
    title: 'Anonymiser un PDF avant de le donner à ChatGPT',
    line: 'La méthode en 5 étapes, et ce que ChatGPT voit encore après.',
  },
  summary: (
    <>
      <P>
        Pour anonymiser un PDF avant de le donner à ChatGPT, retirez du fichier lui-même les noms, adresses, numéros et identifiants, vérifiez qu'aucun texte ne reste sous les zones masquées, puis envoyez la version exportée. Un rectangle noir dessiné dans Word ne suffit pas : dans notre test, ChatGPT a relu les 17 données cachées sous ce type de masquage.
      </P>
      <P>
        [Rature](/) fait ces étapes dans votre navigateur, gratuitement et sans inscription : le PDF n'est envoyé à aucun serveur.
      </P>
    </>
  ),
  sections: [
    {
      id: 'pourquoi-anonymiser',
      title: 'Pourquoi anonymiser un document avant de l\'envoyer à ChatGPT ?',
      content: (
        <>
          <P>
            Quand vous joignez un PDF à ChatGPT, tout son texte part sur les serveurs d'OpenAI. Sur les offres personnelles (Free, Go, Plus, Pro), vos conversations peuvent servir à entraîner les modèles tant que l'option « Améliorer le modèle pour tous » reste activée ([aide OpenAI](https://help.openai.com/fr-fr/articles/7730893-data-controls-faq)). Désactiver cette option ne change rien à l'envoi : le fichier quitte quand même votre ordinateur, et même un chat éphémère peut être conservé jusqu'à 30 jours.
          </P>
          <P>Les professions réglementées ont des règles plus strictes :</P>
          <Ul
            items={[
              '**Avocats.** Le guide pratique du Conseil national des barreaux sur l\'IA générative (septembre 2024) pose une règle claire : l\'avocat « ne doit jamais communiquer des données couvertes par le secret professionnel à des intelligences artificielles génératives ». Il cite le nom, l\'adresse, le téléphone, les informations financières et « tout détail spécifique d\'un dossier qui pourrait permettre d\'identifier une personne ou une entreprise ».',
              '**Entreprises et administrations.** La CNIL recommande d\'encadrer l\'usage de l\'IA générative par une charte, et d\'y interdire selon les cas la fourniture de données confidentielles ou personnelles, en particulier quand le fournisseur peut les réutiliser ([FAQ CNIL du 18 juillet 2024](https://www.cnil.fr/fr/les-questions-reponses-de-la-cnil-sur-lutilisation-dun-systeme-dia-generative)).',
              '**Tout le monde.** Le RGPD impose la minimisation : ne transmettre que les données nécessaires à la tâche. Pour résumer un contrat ou reformuler un courrier, ChatGPT n\'a besoin ni des noms ni de l\'IBAN.',
            ]}
          />
        </>
      ),
    },
    {
      id: 'que-retirer',
      title: 'Que faut-il retirer du document ?',
      content: (
        <>
          <Table
            head={['Type de donnée', 'Exemples', 'Détecté automatiquement par Rature']}
            rows={[
              ['Identité', 'Noms, prénoms, sociétés, organisations', 'Oui'],
              ['Coordonnées', 'Adresses, codes postaux, villes, emails, téléphones', 'Oui'],
              ['Identifiants', 'IBAN, numéros de sécurité sociale, de dossier, d\'immatriculation, références cadastrales', 'Oui'],
              ['Dates et montants', 'Dates de naissance, dates précises, montants', 'Oui, à vérifier selon le contexte'],
              ['Images', 'Logos, signatures, tampons, photos', 'À sélectionner dans l\'édition des images'],
              ['Contexte indirect', 'Une fonction unique (« la seule directrice juridique »), un nom de projet, un lieu précis', 'Non : c\'est à vous d\'en juger à la relecture'],
              ['Métadonnées du fichier', 'Auteur, titre, logiciel, dates de création', 'Oui, supprimées à l\'export'],
            ]}
          />
          <P>
            Le contexte indirect est le piège le plus fréquent. Le CNB le signale aussi : même des données pseudonymisées peuvent identifier un client par croisement, par exemple un montant, un nom de projet interne ou une façon de rédiger un contrat.
          </P>
        </>
      ),
    },
    {
      id: 'etape-par-etape',
      title: 'Comment anonymiser un PDF avant ChatGPT, étape par étape',
      content: (
        <>
          <Steps steps={steps} />
          <P>
            Vous pouvez ensuite donner le fichier exporté à ChatGPT. Précisez dans votre demande que « [OCCULTÉ] » remplace des données retirées volontairement : l'assistant ne cherchera pas à les deviner.
          </P>
          <GuideCta />
        </>
      ),
    },
    {
      id: 'ce-que-chatgpt-voit',
      title: 'Ce que ChatGPT voit après l\'anonymisation',
      content: (
        <>
          <P>
            Nous avons donné à ChatGPT (offre gratuite, modèle par défaut) le même contrat fictif sous deux formes, avec la même demande : lister toutes les personnes, sociétés, adresses, numéros d'immatriculation et coordonnées.
          </P>
          <Stats
            items={[
              { value: '17 sur 17', text: 'données relues par ChatGPT sous un faux caviardage Word (surlignage noir et rectangles).' },
              { value: '0 sur 17', text: 'données retrouvées dans l\'export Rature.' },
            ]}
          />
          <P>
            Sur l'export Rature, ChatGPT conclut que « les données manquantes ne peuvent pas être reconstituées à partir de ce seul document ». Il a pourtant compris l'essentiel : l'objet du contrat, le délai de paiement à 30 jours, la clause de confidentialité et le rôle de chaque partie. Le document reste utile pour l'analyse, sans identifier personne.
          </P>
          <Figure
            name="chatgpt-apres-rature"
            alt="Réponse de ChatGPT sur le contrat anonymisé par Rature : quatre personnes sans nom et deux sociétés non identifiées."
            caption="ChatGPT sur l'export Rature : les fonctions restent, les noms et sociétés ont disparu. Test du 12 octobre 2026."
          />
          <P>
            Méthode complète, fichiers et conversations ChatGPT : [comment vérifier qu'un PDF est vraiment caviardé](/guides/verifier-caviardage-pdf).
          </P>
        </>
      ),
    },
    {
      id: 'anonymisation-ou-pseudonymisation',
      title: 'Anonymisation ou pseudonymisation : que fait Rature ?',
      content: (
        <>
          <P>
            Rature caviarde : chaque donnée sélectionnée est retirée du fichier et remplacée par un bloc noir. Ce n'est pas une pseudonymisation, qui remplacerait « Camille Dufresne » par un alias cohérent comme « Personne A ». Le remplacement par pseudonyme est en préparation dans Rature.
          </P>
          <P>
            Ce que ça change en pratique : ChatGPT ne peut pas distinguer deux personnes masquées. Pour la plupart des documents, les rôles suffisent (« le Client », « le Prestataire », « la Présidente »). Le CNB recommande la pseudonymisation pour ce besoin.
          </P>
          <P>
            Attention au vocabulaire : un document caviardé n'est anonyme, au sens de la CNIL, que si plus personne ne peut être identifié, même indirectement. [Anonymisation ou pseudonymisation : quelle différence ?](/guides/anonymisation-vs-pseudonymisation)
          </P>
        </>
      ),
    },
    {
      id: 'limites',
      title: 'Les limites à connaître',
      content: (
        <Ul
          items={[
            '**PDF scannés.** Rature lit le texte du PDF. Un scan sans couche de texte n\'est pas analysé automatiquement.',
            '**Fichiers Word.** Enregistrez d\'abord le document en PDF, puis anonymisez le PDF.',
            '**Détection automatique.** Elle peut oublier une donnée ou en masquer une de trop. La relecture avant l\'export est indispensable.',
            '**Civilités.** « Mme » et « M. » sont conservés par défaut : ils révèlent le genre. Ajoutez-les à la sélection si besoin.',
          ]}
        />
      ),
    },
  ],
  faq: [
    {
      q: 'Désactiver l\'entraînement dans ChatGPT suffit-il ?',
      a: 'Non. L\'option « Améliorer le modèle pour tous » empêche l\'usage de vos nouvelles conversations pour l\'entraînement, mais le fichier est toujours envoyé et conservé chez OpenAI. Pour un document confidentiel, la seule protection est de ne pas envoyer les données.',
    },
    {
      q: 'Puis-je demander à ChatGPT d\'ignorer les noms ?',
      a: 'Non. Une fois le fichier envoyé, ChatGPT a déjà reçu les noms. Il faut les retirer avant l\'envoi.',
    },
    {
      q: 'ChatGPT Enterprise ou Business change-t-il quelque chose ?',
      a: 'Par défaut, OpenAI n\'entraîne pas ses modèles sur les données de ces offres. Les documents sont tout de même transmis et stockés chez le fournisseur : vérifiez le contrat et les règles de votre profession.',
    },
    {
      q: 'La méthode vaut-elle pour Copilot, Gemini, Claude ou Le Chat de Mistral ?',
      a: 'Oui. Tous ces assistants reçoivent le contenu du fichier que vous leur donnez. Anonymisez le PDF avant de l\'envoyer, quel que soit l\'outil.',
    },
    {
      q: 'Rature est-il gratuit ?',
      a: 'Oui, sans inscription ni limite d\'usage. Le code est ouvert, sous licence AGPL, et le traitement a lieu dans votre navigateur.',
    },
    {
      q: 'Le texte masqué peut-il être récupéré dans l\'export ?',
      a: 'Non. Rature retire le texte du fichier, il ne pose pas un rectangle par-dessus. Un copier-coller ou un outil d\'extraction ne retrouve rien sous les zones masquées.',
    },
  ],
  howTo: { name: 'Comment anonymiser un PDF avant de le donner à ChatGPT', steps },
  sources: [
    'Conseil national des barreaux, [Guide pratique : utilisation des systèmes d\'intelligence artificielle générative](https://cnb.avocat.fr/medias/cnb-guidepratique-utilisation-systemes-iag-2024-68f7b1d86e4570.98487114.pdf), 1re édition, septembre 2024.',
    'CNIL, [Les questions-réponses de la CNIL sur l\'utilisation d\'un système d\'IA générative](https://www.cnil.fr/fr/les-questions-reponses-de-la-cnil-sur-lutilisation-dun-systeme-dia-generative), 18 juillet 2024.',
    'CNIL, [L\'anonymisation de données personnelles](https://www.cnil.fr/fr/technologies/lanonymisation-de-donnees-personnelles), 19 mai 2020.',
    'OpenAI, [Contrôles des données dans ChatGPT](https://help.openai.com/fr-fr/articles/7730893-data-controls-faq), consulté le 21 octobre 2026.',
    'Rature, [test de faux caviardage avec ChatGPT](/guides/verifier-caviardage-pdf), 12 et 13 octobre 2026.',
  ],
  related: ['/guides/verifier-caviardage-pdf', '/guides/anonymisation-vs-pseudonymisation'],
};
