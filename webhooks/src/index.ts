import {TaJsonDeserialize} from 'r2-lcp-js/dist/es6-es2015/src/serializable';
import {OPDSFeed} from 'r2-opds-js/dist/es6-es2015/src/opds/opds2/opds2';
import {Publication as R2Publication} from 'r2-shared-js/dist/es6-es2015/src/models/publication';
import {opdsFeedViewConverter, webpubViewConverter} from './di';
import * as util from 'util';

const json = {
  metadata: {
    title: 'audiobok feed',
  },
  links: [
    {
      rel: 'self',
      href: 'https://storage.googleapis.com/audiobook_edrlab/feed.json',
      type: 'application/opds+json',
    },
    {
      rel: 'search',
      href: 'search function link',
      type: 'application/opds+json',
    },
  ],
  navigation: [
    {
      href:
        'https://storage.googleapis.com/audiobook_edrlab/navigation/all.json',
      title: 'All Publications',
      type: 'application/opds+json',
    },
    {
      href:
        'https://storage.googleapis.com/audiobook_edrlab/groups/popular.json',
      title: 'Popular Publications',
      type: 'application/opds+json',
      rel: 'http://opds-spec.org/sort/popular',
    },
  ],
  groups: [
    {
      metadata: {
        title: 'popular audiobooks',
        numberOfItems: 2,
      },
      links: [
        {
          rel: 'self',
          href:
            'https://storage.googleapis.com/audiobook_edrlab/groups/popular.json',
          type: 'application/opds+json',
        },
      ],
      publications: [
        {
          metadata: {
            '@type': 'http://schema.org/Audiobook',
            title: "L'assommoir",
            identifier: 'assommoir_emile_zola',
            author: 'Emile Zola',
            publisher: 'archive',
            language: 'fr',
            description:
              "L'Assommoir est un roman d'Émile Zola publié en feuilleton dès 1876 dans Le Bien public, puis dans La République des Lettres, avant sa sortie en livre en 1877 chez l'éditeur Georges Charpentier. C'est le septième volume de la série Les Rougon-Macquart.",
            rights: '',
            duration: 61664,
            subject: 'roman',
          },
          links: [
            {
              type: 'application/opds-publication+json',
              rel: 'self',
              href:
                'https://storage.googleapis.com/audiobook_edrlab/opdspub/assommoir_emile_zola.json',
            },
            {
              rel: 'http://opds-spec.org/acquisition/open-access',
              type: 'application/webpub+json',
              href:
                'https://storage.googleapis.com/audiobook_edrlab/webpub/assommoir_emile_zola.json',
            },
          ],
          images: [
            {
              type: 'image/jpeg',
              href:
                'https://ia600200.us.archive.org/8/items/LAssommoir/__ia_thumb.jpg',
            },
          ],
        },
        {
          metadata: {
            '@type': 'http://schema.org/Audiobook',
            title: 'Du contrat social',
            identifier: 'du_contrat_social_rousseau',
            author: 'Rousseau',
            publisher: 'archive',
            language: 'fr',
            description:
              "Du contrat social ou Principes du droit politique est un ouvrage de philosophie politique pensé et écrit par Jean-Jacques Rousseau, publié en 1762. L'œuvre a constitué un tournant décisif pour la modernité et s'est imposée comme un des textes majeurs de la philosophie politique et sociale, en affirmant le principe de souveraineté du peuple appuyé sur les notions de liberté, d'égalité, et de volonté générale. ",
            rights: '',
            duration: 14127,
            subject: 'essai',
          },
          links: [
            {
              type: 'application/opds-publication+json',
              rel: 'self',
              href:
                'https://storage.googleapis.com/audiobook_edrlab/opdspub/du_contrat_social_rousseau.json',
            },
            {
              rel: 'http://opds-spec.org/acquisition/open-access',
              href:
                'https://storage.googleapis.com/audiobook_edrlab/webpub/du_contrat_social_rousseau.json',
              type: 'application/webpub+json',
            },
          ],
          images: [
            {
              type: 'image/jpeg',
              href:
                'https://upload.wikimedia.org/wikipedia/commons/d/db/Social_contract_rousseau_page.jpg',
            },
          ],
        },
      ],
    },
  ],
};

const feed = TaJsonDeserialize(json, OPDSFeed);
const view = opdsFeedViewConverter.convertOpdsFeedToView(
  feed,
  'https://storage.googleapis.com/'
);

console.log(util.inspect(view, {showHidden: false, depth: null}));
