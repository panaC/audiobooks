import {webpubViewConverter} from '../../src/di';
import {Publication as R2Publication} from '@r2-shared-js/models/publication';
import {
  TaJsonDeserialize,
  TaJsonSerialize,
} from 'r2-lcp-js/dist/es6-es2015/src/serializable';

import * as assert from 'assert';

const json = {
  '@context': 'https://readium.org/webpub-manifest/context.jsonld',
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
      type: 'application/webpub+json',
      rel: 'self',
      href:
        'https://storage.googleapis.com/audiobook_edrlab/webpub/assommoir_emile_zola.json',
    },
  ],
  readingOrder: [
    {
      href:
        'https://archive.org/download/LAssommoir/Emile-Zola-L-Assommoir-Chapitre01.mp3',
      type: 'audio/mpeg',
      duration: 4054,
    },
    {
      href:
        'https://archive.org/download/LAssommoir/Emile-Zola-L-Assommoir-chapitre02.mp3',
      type: 'audio/mpeg',
      duration: 3979,
    },
    {
      href:
        'https://archive.org/download/LAssommoir/Emile-Zola-L-Assommoir-chapitre03.mp3',
      type: 'audio/mpeg',
      duration: 4253,
    },
    {
      href:
        'https://archive.org/download/LAssommoir/Emile-Zola-L-Assommoir-chapitre04.mp3',
      type: 'audio/mpeg',
      duration: 4232,
    },
    {
      href:
        'https://archive.org/download/LAssommoir/Emile-Zola-L-Assommoir-chapitre05.mp3',
      type: 'audio/mpeg',
      duration: 4697,
    },
    {
      href:
        'https://archive.org/download/LAssommoir/Emile-Zola-L-Assommoir-chapitre06.mp3',
      type: 'audio/mpeg',
      duration: 4754,
    },
    {
      href:
        'https://archive.org/download/LAssommoir/Emile-Zola-L-Assommoir-chapitre07.mp3',
      type: 'audio/mpeg',
      duration: 5536,
    },
    {
      href:
        'https://archive.org/download/LAssommoir/Emile-Zola-L-Assommoir-chapitre08.mp3',
      type: 'audio/mpeg',
      duration: 5649,
    },
    {
      href:
        'https://archive.org/download/LAssommoir/Emile-Zola-L-Assommoir-chapitre09.mp3',
      type: 'audio/mpeg',
      duration: 5738,
    },
    {
      href:
        'https://archive.org/download/LAssommoir/Emile-Zola-L-Assommoir-chapitre10.mp3',
      type: 'audio/mpeg',
      duration: 5734,
    },
    {
      href:
        'https://archive.org/download/LAssommoir/Emile-Zola-L-Assommoir-chapitre11.mp3',
      type: 'audio/mpeg',
      duration: 5973,
    },
    {
      href:
        'https://archive.org/download/LAssommoir/Emile-Zola-L-Assommoir-chapitre12.mp3',
      type: 'audio/mpeg',
      duration: 4723,
    },
    {
      href:
        'https://archive.org/download/LAssommoir/Emile-Zola-L-Assommoir-chapitre13.mp3',
      type: 'audio/mpeg',
      duration: 2342,
    },
  ],
  resources: [
    {
      type: 'image/jpeg',
      rel: 'cover',
      href: 'https://ia600200.us.archive.org/8/items/LAssommoir/__ia_thumb.jpg',
    },
  ],
  toc: [],
  landmarks: [],
};

describe('webpub view converter', () => {
  it('test', () => {
    const pub = TaJsonDeserialize(json, R2Publication);

    const view = webpubViewConverter.convertWebpubToView(
      pub,
      'https://storage.googleapis.com/audiobook_edrlab/webpub/'
    );

    assert.ok(typeof view.identifier === 'string');

    view.identifier = '';

    assert.deepStrictEqual(
      {
        identifier: '',
        title: "L'assommoir",
        authors: ['Emile Zola'],
        description:
          "L'Assommoir est un roman d'Émile Zola publié en feuilleton dès 1876 dans Le Bien public, puis dans La République des Lettres, avant sa sortie en livre en 1877 chez l'éditeur Georges Charpentier. C'est le septième volume de la série Les Rougon-Macquart.",
        languages: ['fr'],
        publishers: ['archive'],
        workIdentifier: 'assommoir_emile_zola',
        publishedAt: undefined,
        cover:
          'https://ia600200.us.archive.org/8/items/LAssommoir/__ia_thumb.jpg',
        RDFType: 'http://schema.org/Audiobook',
        duration: 61664,
        nbOfTracks: 13,
        readingOrders: [
          {
            duration: 4054,
            url:
              'https://archive.org/download/LAssommoir/Emile-Zola-L-Assommoir-Chapitre01.mp3',
          },
          {
            duration: 3979,
            url:
              'https://archive.org/download/LAssommoir/Emile-Zola-L-Assommoir-chapitre02.mp3',
          },
          {
            duration: 4253,
            url:
              'https://archive.org/download/LAssommoir/Emile-Zola-L-Assommoir-chapitre03.mp3',
          },
          {
            duration: 4232,
            url:
              'https://archive.org/download/LAssommoir/Emile-Zola-L-Assommoir-chapitre04.mp3',
          },
          {
            duration: 4697,
            url:
              'https://archive.org/download/LAssommoir/Emile-Zola-L-Assommoir-chapitre05.mp3',
          },
          {
            duration: 4754,
            url:
              'https://archive.org/download/LAssommoir/Emile-Zola-L-Assommoir-chapitre06.mp3',
          },
          {
            duration: 5536,
            url:
              'https://archive.org/download/LAssommoir/Emile-Zola-L-Assommoir-chapitre07.mp3',
          },
          {
            duration: 5649,
            url:
              'https://archive.org/download/LAssommoir/Emile-Zola-L-Assommoir-chapitre08.mp3',
          },
          {
            duration: 5738,
            url:
              'https://archive.org/download/LAssommoir/Emile-Zola-L-Assommoir-chapitre09.mp3',
          },
          {
            duration: 5734,
            url:
              'https://archive.org/download/LAssommoir/Emile-Zola-L-Assommoir-chapitre10.mp3',
          },
          {
            duration: 5973,
            url:
              'https://archive.org/download/LAssommoir/Emile-Zola-L-Assommoir-chapitre11.mp3',
          },
          {
            duration: 4723,
            url:
              'https://archive.org/download/LAssommoir/Emile-Zola-L-Assommoir-chapitre12.mp3',
          },
          {
            duration: 2342,
            url:
              'https://archive.org/download/LAssommoir/Emile-Zola-L-Assommoir-chapitre13.mp3',
          },
        ],
      },
      view
    );
  });
});
