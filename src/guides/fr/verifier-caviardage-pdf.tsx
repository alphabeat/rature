import ogImage from '@/assets/guides/og-verifier-caviardage.png';
import { Callout, Figure, P, PdfDownload, Quote, Steps, Table, Ul } from '@/components/guides/GuideBlocks.tsx';
import { GuideCta } from '@/components/guides/GuideCta.tsx';
import type { Guide, GuideStep } from '@/guides/types.ts';

const steps: GuideStep[] = [
  {
    title: 'Copiez-collez tout le texte.',
    text: 'Ouvrez le PDF, sélectionnez tout (Ctrl+A ou Cmd+A), copiez, puis collez dans un éditeur de texte (Bloc-notes, TextEdit). Si une donnée masquée apparaît, le caviardage est faux.',
  },
  {
    title: 'Cherchez un mot masqué.',
    text: 'Avec Ctrl+F (Cmd+F), tapez un nom ou un numéro que vous savez caviardé. S\'il est trouvé, il est toujours dans le fichier.',
  },
  {
    title: 'Vérifiez les images.',
    text: 'Un rectangle posé sur un logo, une signature ou une page scannée laisse l\'image entière dessous. Essayez de sélectionner ou de déplacer l\'image dans un éditeur PDF. Attention aussi aux scans « océrisés » : ils contiennent une couche de texte invisible.',
  },
  {
    title: 'Contrôlez les métadonnées et les éléments cachés.',
    text: 'Dans Fichier > Propriétés, regardez le titre, l\'auteur et les mots-clés. Vérifiez aussi les commentaires, les calques, les signets et les pièces jointes.',
  },
  {
    title: 'Pour aller plus loin : la ligne de commande.',
    text: 'Les outils gratuits de Poppler extraient tout ce que contient le fichier : `pdftotext` pour le texte, `pdfimages -list` pour les images, `pdfinfo` pour les métadonnées.',
  },
];

export const verifierCaviardagePdf: Guide = {
  path: '/guides/verifier-caviardage-pdf',
  title: 'Vérifier un caviardage PDF : 5 tests en 2 minutes | Rature',
  description: 'Un rectangle noir ne supprime pas le texte. 5 tests pour vérifier un caviardage PDF, et notre test : ChatGPT a relu 17 données sur 17 sous un faux caviardage.',
  ogTitle: 'Sous un faux caviardage Word, ChatGPT a relu 17 données sur 17',
  heading: 'Comment vérifier qu\'un PDF est vraiment caviardé ?',
  ogImage: {
    src: ogImage,
    alt: 'Sous un faux caviardage Word, ChatGPT a relu 17 données sur 17. L\'export Rature : 0 sur 17.',
  },
  breadcrumb: 'Vérifier un caviardage PDF',
  readingTime: 7,
  card: {
    title: 'Vérifier qu\'un PDF est vraiment caviardé',
    line: '5 tests en 2 minutes. Sous un faux caviardage Word, ChatGPT a relu 17 données sur 17.',
  },
  summary: (
    <>
      <P>
        Pour vérifier un caviardage, sélectionnez tout le texte du PDF (Ctrl+A, ou Cmd+A sur Mac), copiez-le et collez-le dans un éditeur de texte : si un nom masqué réapparaît, le caviardage est faux. Complétez par une recherche (Ctrl+F) sur un mot masqué, puis vérifiez les images, les métadonnées et les annotations.
      </P>
      <P>
        Le problème est courant : un rectangle noir ou un surlignage noir cache le texte à l'écran, mais le laisse dans le fichier. Dans notre test, ChatGPT a retrouvé les 17 données d'un contrat « caviardé » dans Word.
      </P>
    </>
  ),
  sections: [
    {
      id: 'rectangle-noir',
      title: 'Pourquoi un rectangle noir ne cache pas le texte',
      content: (
        <>
          <P>
            Un PDF superpose plusieurs couches : le texte, les images, les formes dessinées. Un rectangle noir ajouté dans Word, dans un lecteur PDF ou dans Aperçu est une forme de plus, posée au-dessus du texte. Le surlignage noir, lui, change seulement la couleur de fond. Dans les deux cas, le texte reste dans le fichier : un copier-coller, une recherche ou un assistant d'IA le lisent sans difficulté.
          </P>
          <P>Un vrai caviardage retire le texte du fichier, puis dessine le bloc noir à sa place.</P>
          <P>L'erreur touche aussi les professionnels :</P>
          <Ul
            items={[
              '**Janvier 2019, avocats de Paul Manafort.** Une pièce déposée au tribunal fédéral américain contenait des passages masqués qu\'un simple copier-coller rendait lisibles ([Atlanta Journal-Constitution](https://www.ajc.com/blog/jamie-dupree/manafort-legal-team-botches-redactions-reveals-campaign-contacts-with-russian/iyGwxLTb04zd3cnxzb4MOL/)).',
              '**Décembre 2025, dossiers Epstein.** Dans certains documents publiés par le ministère américain de la Justice, le texte sous les rectangles noirs se récupérait de la même façon ([Mediaite](https://www.mediaite.com/media/news/doj-redactions-of-some-epstein-files-easily-revealed-with-copy-and-paste)).',
            ]}
          />
        </>
      ),
    },
    {
      id: 'notre-test',
      title: 'Notre test : un contrat caviardé dans Word, lu par ChatGPT',
      content: (
        <>
          <P>
            **Méthode.** Un contrat de prestation de services fictif : 2 sociétés, 3 personnes, 2 adresses, 2 numéros RCS, un IBAN, un téléphone et un email, soit 17 données. Nous l'avons « caviardé » dans Word comme on le fait souvent : surlignage noir sur les noms, rectangles noirs sur les adresses, numéros et coordonnées. Puis « Enregistrer sous &gt; PDF ». Le même contrat a été anonymisé avec Rature, réglages par défaut. Les deux PDF ont été donnés à ChatGPT (offre gratuite, modèle par défaut), dans deux conversations neuves, avec la même demande :
          </P>
          <Quote>Voici un contrat. Liste toutes les personnes, sociétés, adresses, numéros d'immatriculation et coordonnées (téléphone, email, IBAN) qui y figurent.</Quote>
          <Figure
            name="caviardage-word-apparence"
            alt="Contrat exporté en PDF depuis Word, avec les noms, adresses et numéros recouverts de rectangles noirs."
            caption="Le faux caviardage Word : à l'écran, tout semble masqué."
          />
          <P>**Résultats.**</P>
          <Table
            head={['', 'Faux caviardage Word', 'Export Rature']}
            rows={[
              ['Données lisibles par copier-coller', '17 sur 17', '0 sur 17'],
              ['Données citées par ChatGPT', '17 sur 17', '0 sur 17'],
              ['Logo recouvert d\'un rectangle (second test)', 'Récupérable en pleine résolution', 'Supprimé du fichier'],
              ['Métadonnées du fichier', 'Logiciel et version du système conservés', 'Supprimées'],
            ]}
          />
          <P>
            Sur le faux caviardage, ChatGPT répond par « l'inventaire exhaustif des personnes, sociétés, adresses et coordonnées » : les trois noms, les deux sociétés, les adresses, les numéros RCS, le téléphone, l'email et l'IBAN, avec un bouton « Copier l'IBAN ». Rien dans sa réponse ne montre qu'il a remarqué les rectangles noirs ([conversation complète](https://chatgpt.com/share/6accb905-a63c-83ed-98d7-64af315dcd52)).
          </P>
          <Figure
            name="chatgpt-lit-faux-caviardage"
            alt="ChatGPT liste les noms complets des trois personnes du contrat, pourtant masqués en noir dans le PDF."
            caption="ChatGPT sur le PDF caviardé dans Word : les noms masqués apparaissent en clair."
          />
          <P>
            Sur l'export Rature, ChatGPT ne retrouve aucune des 17 données et conclut que « les données manquantes ne peuvent pas être reconstituées à partir de ce seul document » ([conversation complète](https://chatgpt.com/share/6accbbd1-d4cc-83ed-bb7e-cecf54875b41)). Seule trace : le numéro de rue « 8 », isolé, qui ne permet pas de retrouver l'adresse.
          </P>
          <P>
            **Le logo.** Dans un second test (13 octobre 2026, contrat de 2 pages), le logo du client était recouvert d'un rectangle noir dans Word. L'image entière restait dans le PDF, et un outil d'extraction l'a récupérée en pleine résolution.
          </P>
          <Figure
            name="logo-sous-rectangle"
            alt="Logo « Belvane Conseil » extrait intact du PDF, alors qu'il était recouvert d'un rectangle noir."
            caption="Le logo extrait de sous le rectangle noir, en pleine résolution."
          />
          <PdfDownload>Téléchargez le PDF du test (contrat fictif, 49 Ko) et faites le copier-coller vous-même.</PdfDownload>
        </>
      ),
    },
    {
      id: 'cinq-tests',
      title: '5 tests pour vérifier un caviardage PDF',
      content: (
        <>
          <Steps steps={steps} />
          <Callout>
            Ne testez jamais un document réel en l'envoyant à un outil en ligne ou à ChatGPT : c'est précisément la fuite que vous cherchez à éviter. Les tests ci-dessus se font sur votre ordinateur.
          </Callout>
        </>
      ),
    },
    {
      id: 'caviardage-faux',
      title: 'Que faire si le caviardage est faux ?',
      content: (
        <>
          <Ul
            items={[
              '**Le document n\'est pas encore parti.** Repartez du fichier d\'origine et utilisez un outil qui retire le texte : [Rature](/), ou l\'outil de caviardage d\'Acrobat Pro (les masquages n\'y sont définitifs qu\'une fois appliqués). Refaites ensuite les 5 tests.',
              '**Le document a déjà été envoyé.** Si des données personnelles sont exposées, il peut s\'agir d\'une violation de données au sens du RGPD. Prévenez votre DPO : une notification à la CNIL est due dans les 72 heures lorsque la violation présente un risque pour les personnes concernées.',
            ]}
          />
          <GuideCta />
        </>
      ),
    },
    {
      id: 'comment-rature-caviarde',
      title: 'Comment Rature caviarde un PDF',
      content: (
        <Ul
          items={[
            '**Le texte est retiré, pas recouvert.** Chaque donnée sélectionnée est supprimée du contenu de la page, puis remplacée par un bloc « [OCCULTÉ] ».',
            '**Les images sont traitées.** Les logos, signatures et tampons sélectionnés sont occultés ou supprimés du fichier.',
            '**Les métadonnées sont effacées** à l\'export : titre, auteur, logiciel et dates d\'origine.',
            '**Tout se passe dans votre navigateur.** Le PDF n\'est envoyé à aucun serveur, et le code est ouvert ([GitHub](https://github.com/alphabeat/rature)) : chacun peut vérifier ce qu\'il fait.',
          ]}
        />
      ),
    },
  ],
  faq: [
    {
      q: 'Le surlignage noir dans Word est-il un caviardage ?',
      a: 'Non. Il change la couleur derrière le texte, qui reste dans le fichier et dans le PDF exporté. Un copier-coller le fait réapparaître.',
    },
    {
      q: 'Imprimer en PDF supprime-t-il le texte caché ?',
      a: 'En général non : l\'impression vers PDF conserve le texte, et les rectangles restent de simples formes au-dessus. Seule une conversion en image retire le texte, au prix d\'un document illisible pour la recherche et l\'accessibilité.',
    },
    {
      q: 'Un PDF scanné peut-il contenir du texte caché ?',
      a: 'Oui, s\'il a été « océrisé » : la reconnaissance de caractères ajoute une couche de texte invisible sous l\'image. Un rectangle noir posé sur le scan ne la retire pas.',
    },
    {
      q: 'Les annotations de caviardage d\'Acrobat sont-elles fiables ?',
      a: 'Seulement une fois appliquées. Tant que le caviardage est à l\'état de marque, le texte est toujours dans le fichier.',
    },
    {
      q: 'Comment prouver qu\'un document est bien caviardé ?',
      a: 'Conservez le résultat des tests : copier-coller sans donnée masquée, recherche infructueuse, liste d\'images et métadonnées vides. Avec Rature, le code est public, ce qui permet de vérifier la méthode.',
    },
  ],
  howTo: { name: 'Comment vérifier qu\'un PDF est vraiment caviardé', steps },
  sources: [
    'Rature, test de faux caviardage du 12 octobre 2026 : conversations ChatGPT [sur le PDF Word](https://chatgpt.com/share/6accb905-a63c-83ed-98d7-64af315dcd52) et [sur l\'export Rature](https://chatgpt.com/share/6accbbd1-d4cc-83ed-bb7e-cecf54875b41).',
    'Jamie Dupree, [Manafort legal team botches redactions](https://www.ajc.com/blog/jamie-dupree/manafort-legal-team-botches-redactions-reveals-campaign-contacts-with-russian/iyGwxLTb04zd3cnxzb4MOL/), Atlanta Journal-Constitution, 8 janvier 2019.',
    'Mediaite, [DOJ Redactions of Some Epstein Files Easily Revealed With Copy and Paste](https://www.mediaite.com/media/news/doj-redactions-of-some-epstein-files-easily-revealed-with-copy-and-paste), décembre 2025.',
    'RGPD, [article 33 : notification à l\'autorité de contrôle d\'une violation de données](https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre4#Article33).',
    'Poppler, [outils pdftotext, pdfimages et pdfinfo](https://poppler.freedesktop.org/).',
  ],
  related: ['/guides/anonymiser-pdf-avant-chatgpt', '/guides/anonymisation-vs-pseudonymisation'],
};
