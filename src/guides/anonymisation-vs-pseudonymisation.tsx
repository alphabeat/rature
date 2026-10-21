import { Ol, P, Table, Ul } from '@/components/guides/GuideBlocks.tsx';
import { GuideCta } from '@/components/guides/GuideCta.tsx';
import type { Guide } from '@/guides/types.ts';

export const anonymisationVsPseudonymisation: Guide = {
  path: '/guides/anonymisation-vs-pseudonymisation',
  title: 'Anonymisation ou pseudonymisation : différence et exemples (RGPD) | Rature',
  description: 'L\'anonymisation est irréversible et sort les données du RGPD. La pseudonymisation est réversible : les données restent personnelles. Définitions CNIL et exemples sur un contrat.',
  ogTitle: 'Anonymisation ou pseudonymisation : la différence, exemples à l\'appui',
  heading: 'Anonymisation ou pseudonymisation : quelle différence ?',
  breadcrumb: 'Anonymisation ou pseudonymisation',
  readingTime: 6,
  card: {
    title: 'Anonymisation ou pseudonymisation : quelle différence ?',
    line: 'Définitions de la CNIL, exemples sur un contrat, et ce qu\'il faut choisir avant d\'utiliser une IA.',
  },
  summary: (
    <>
      <P>
        L'anonymisation rend toute identification d'une personne impossible, de manière irréversible : les données ne sont plus personnelles et le RGPD ne s'applique plus. La pseudonymisation remplace les identifiants directs (nom, prénom) par un alias, mais reste réversible : les données restent personnelles et le RGPD s'applique.
      </P>
      <P>
        Le caviardage, qui retire des passages d'un document, est un moyen d'y parvenir, pas une garantie : un document caviardé n'est anonyme que si personne ne peut plus être identifié, même indirectement.
      </P>
    </>
  ),
  sections: [
    {
      id: 'definitions-cnil',
      title: 'Les définitions de la CNIL',
      content: (
        <Ul
          items={[
            '**Anonymisation** : « un traitement qui consiste à utiliser un ensemble de techniques de manière à rendre impossible, en pratique, toute identification de la personne par quelque moyen que ce soit et de manière irréversible » (CNIL).',
            '**Pseudonymisation** : un traitement qui empêche d\'attribuer les données à une personne sans information supplémentaire. En pratique, on remplace les données directement identifiantes (nom, prénom) par des données indirectement identifiantes (alias, numéro). La CNIL précise que l\'identité peut souvent être retrouvée grâce à des données tierces, et que l\'opération est réversible (RGPD, article 4).',
          ]}
        />
      ),
    },
    {
      id: 'tableau-comparatif',
      title: 'Tableau comparatif',
      content: (
        <Table
          head={['', 'Anonymisation', 'Pseudonymisation']}
          rows={[
            ['Principe', 'Plus personne ne peut être identifié', 'Les identifiants directs sont remplacés par des alias'],
            ['Réversible', 'Non', 'Oui, avec la table de correspondance'],
            ['Données personnelles au sens du RGPD', 'Non', 'Oui'],
            ['Le RGPD s\'applique', 'Non', 'Oui (c\'est une mesure de sécurité recommandée)'],
            ['Exemple', '« La représentante légale du client »', '« Mme A, Présidente de la société X »'],
            ['Usage typique', 'Open data, statistiques, publication', 'Recherche, analyse interne, travail avec une IA'],
          ]}
        />
      ),
    },
    {
      id: 'exemple-contrat',
      title: 'Exemple sur une phrase de contrat',
      content: (
        <>
          <P>Original : « Mme Camille Dufresne, Présidente de Lumen Conseil SAS, 14 rue des Tanneurs, 69002 Lyon »</P>
          <Ul
            items={[
              '**Pseudonymisée** : « Mme A, Présidente de la société X, Lyon ». La méthode suggérée par le CNB : des initiales fictives et une zone géographique plus large. Avec la table « A = Camille Dufresne », on revient à l\'original.',
              '**Caviardée (Rature)** : « Mme [OCCULTÉ], Présidente de [OCCULTÉ], [OCCULTÉ] ». Les identifiants directs sont retirés du fichier, sans table de correspondance.',
              '**Anonymisée** : « La représentante légale du client ». Il faut aussi retirer ce qui permet de recouper : la fonction précise, la ville, la date, le montant. C\'est le contexte qui décide.',
            ]}
          />
        </>
      ),
    },
    {
      id: 'trois-criteres',
      title: 'Les 3 critères d\'une anonymisation réussie',
      content: (
        <>
          <P>
            Les autorités européennes de protection des données retiennent trois critères (avis 05/2014 du groupe de l'article 29, repris par la CNIL). Appliqués à un document :
          </P>
          <Ol
            items={[
              '**Individualisation** : on ne doit pas pouvoir isoler une personne. Si le contrat mentionne « la directrice juridique » d\'une PME de 20 salariés, elle est isolée, même sans son nom.',
              '**Corrélation** : on ne doit pas pouvoir relier le document à d\'autres sources sur la même personne. Un numéro RCS ou une adresse de siège se retrouve en deux clics dans les registres publics.',
              '**Inférence** : on ne doit pas pouvoir déduire une information sur une personne. « Mme » et « M. » laissés en clair révèlent le genre de chaque signataire.',
            ]}
          />
          <P>Si l'un de ces risques demeure, le document n'est pas anonyme : il est pseudonymisé, et le RGPD continue de s'appliquer.</P>
        </>
      ),
    },
    {
      id: 'caviardage-occultation',
      title: 'Et le caviardage, ou l\'occultation ?',
      content: (
        <>
          <P>
            Caviarder (ou occulter) un document, c'est en retirer des passages pour qu'ils ne soient plus lisibles. C'est une technique, pas un statut juridique. Selon ce que vous retirez, le résultat est pseudonymisé ou anonymisé.
          </P>
          <P>
            Exemple connu : pour l'open data des décisions de justice, les noms et prénoms des personnes physiques parties ou tiers sont occultés avant publication (article L. 111-13 du code de l'organisation judiciaire). Les autres éléments identifiants ne sont occultés que s'ils mettent en danger la sécurité ou la vie privée des personnes.
          </P>
          <P>
            Un caviardage n'est utile que s'il retire vraiment le texte. Un rectangle noir posé par-dessus laisse les données lisibles : [comment vérifier un caviardage PDF](/guides/verifier-caviardage-pdf).
          </P>
        </>
      ),
    },
    {
      id: 'cour-de-justice-2025',
      title: 'Ce qu\'a jugé la Cour de justice de l\'UE en 2025',
      content: (
        <>
          <P>
            Dans l'arrêt CEPD contre CRU du 4 septembre 2025 (C-413/23 P), la Cour de justice a précisé que la nature des données pseudonymisées dépend de qui les détient. Pour l'organisme qui garde la table de correspondance, elles restent personnelles. Pour un destinataire qui n'a aucun moyen raisonnable de réidentifier les personnes, elles peuvent ne pas l'être. L'appréciation se fait au cas par cas.
          </P>
          <P>
            Le Comité européen de la protection des données a par ailleurs adopté en janvier 2025 des lignes directrices sur la pseudonymisation (01/2025), qui la présentent comme une mesure de protection, pas comme une sortie du RGPD.
          </P>
        </>
      ),
    },
    {
      id: 'que-choisir-avant-une-ia',
      title: 'Que choisir avant d\'utiliser une IA comme ChatGPT ?',
      content: (
        <>
          <Ul
            items={[
              '**Pour un avocat**, le CNB recommande la pseudonymisation : remplacer les noms des clients par des initiales fictives et les adresses par une zone plus large. Il rappelle qu\'aucune donnée couverte par le secret professionnel ne doit être communiquée à une IA générative.',
              '**Si l\'IA doit distinguer les personnes** (qui a signé, qui doit payer), la pseudonymisation garde cette information : « Personne A » et « Personne B ».',
              '**Si les rôles suffisent** (résumer, reformuler, chercher une clause), le caviardage retire plus et ne laisse aucune table à protéger.',
            ]}
          />
          <P>
            Dans les deux cas, relisez le contexte : une fonction, une date ou un montant peuvent suffire à identifier quelqu'un. [Anonymiser un PDF avant de le donner à ChatGPT](/guides/anonymiser-pdf-avant-chatgpt)
          </P>
          <GuideCta />
        </>
      ),
    },
    {
      id: 'lexique',
      title: 'Lexique',
      content: (
        <Ul
          items={[
            '**Donnée personnelle** : toute information se rapportant à une personne physique identifiée ou identifiable, directement ou indirectement.',
            '**Donnée directement identifiante** : nom, prénom, photo, numéro de sécurité sociale.',
            '**Donnée indirectement identifiante** : fonction, adresse, date de naissance, numéro de dossier, qui identifient une personne une fois croisés.',
            '**Anonymisation** : traitement irréversible qui rend toute identification impossible en pratique.',
            '**Pseudonymisation** : remplacement des identifiants directs par des alias, réversible avec une information supplémentaire.',
            '**Table de correspondance** : la liste qui relie chaque alias à la vraie personne. À conserver séparément et à protéger.',
            '**Caviardage, occultation** : retrait de passages d\'un document pour qu\'ils ne soient plus lisibles.',
            '**Faux caviardage** : masquage visuel (rectangle ou surlignage noir) qui laisse le texte dans le fichier.',
            '**Réidentification** : retrouver l\'identité d\'une personne à partir de données censées l\'avoir masquée.',
            '**Minimisation** : principe du RGPD selon lequel on ne traite que les données nécessaires à la finalité.',
          ]}
        />
      ),
    },
  ],
  faq: [
    {
      q: 'Des données pseudonymisées sont-elles soumises au RGPD ?',
      a: 'Oui, pour l\'organisme qui peut réidentifier les personnes. La CNIL les considère comme des données personnelles. La Cour de justice de l\'UE admet qu\'elles peuvent ne pas l\'être pour un destinataire qui n\'a aucun moyen raisonnable de réidentification.',
    },
    {
      q: 'Un document caviardé est-il anonyme ?',
      a: 'Pas forcément. Il l\'est seulement si plus personne ne peut être identifié, y compris par le contexte (fonction, lieu, date) ou par recoupement avec d\'autres sources.',
    },
    {
      q: 'Le RGPD impose-t-il d\'anonymiser ?',
      a: 'Non, il n\'y a pas d\'obligation générale d\'anonymisation. C\'est une solution pour réutiliser ou conserver des données au-delà de leur durée de conservation.',
    },
    {
      q: 'Masquer et anonymiser, est-ce la même chose ?',
      a: 'Non. Masquer cache une information à l\'écran. Si le texte reste dans le fichier, rien n\'est anonymisé.',
    },
    {
      q: 'Rature fait-il de la pseudonymisation ?',
      a: 'Pas encore. Rature retire les données et les remplace par un bloc « [OCCULTÉ] ». Le remplacement par pseudonyme cohérent est en préparation.',
    },
  ],
  sources: [
    'CNIL, [L\'anonymisation de données personnelles](https://www.cnil.fr/fr/technologies/lanonymisation-de-donnees-personnelles), 19 mai 2020.',
    'RGPD, [article 4 (définitions) et considérant 26](https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre1#Article4).',
    'Groupe de travail « article 29 », [avis 05/2014 sur les techniques d\'anonymisation](https://ec.europa.eu/justice/article-29/documentation/opinion-recommendation/files/2014/wp216_fr.pdf), 10 avril 2014.',
    'Conseil national des barreaux, [Guide pratique : utilisation des systèmes d\'intelligence artificielle générative](https://cnb.avocat.fr/medias/cnb-guidepratique-utilisation-systemes-iag-2024-68f7b1d86e4570.98487114.pdf), septembre 2024.',
    'Cour de justice de l\'UE, [arrêt C-413/23 P, CEPD contre CRU](https://curia.europa.eu/juris/liste.jsf?num=C-413/23), 4 septembre 2025.',
    'CEPD, [lignes directrices 01/2025 sur la pseudonymisation](https://www.edpb.europa.eu/our-work-tools/documents/public-consultations/2025/guidelines-012025-pseudonymisation_en), janvier 2025.',
    '[Code de l\'organisation judiciaire](https://www.legifrance.gouv.fr/codes/texte_lc/LEGITEXT000006071164), article L. 111-13 (issu de la loi du 23 mars 2019).',
  ],
  related: ['/guides/anonymiser-pdf-avant-chatgpt', '/guides/verifier-caviardage-pdf'],
};
