import * as assert from 'assert';
import {TaJsonDeserialize} from 'r2-lcp-js/dist/es6-es2015/src/serializable';
import {OPDSFeed} from 'r2-opds-js/dist/es6-es2015/src/opds/opds2/opds2';
import {OpdsFeedViewConverter} from 'src/converter/opds';

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

describe('opdsfeed view converter', () => {
  it('test', () => {
    const feed = TaJsonDeserialize(json, OPDSFeed);
    const view = new OpdsFeedViewConverter().convertOpdsFeedToView(
      feed,
      'https://storage.googleapis.com/'
    );

    assert.deepStrictEqual(
      {
        title: 'audiobok feed',
        metadata: {
          numberOfItems: undefined,
          itemsPerPage: undefined,
          currentPage: undefined,
        },
        publications: undefined,
        navigation: [
          {
            title: 'All Publications',
            subtitle: undefined,
            url:
              'https://storage.googleapis.com/audiobook_edrlab/navigation/all.json',
            numberOfItems: undefined,
          },
          {
            title: 'Popular Publications',
            subtitle: undefined,
            url:
              'https://storage.googleapis.com/audiobook_edrlab/groups/popular.json',
            numberOfItems: undefined,
          },
        ],
        links: {
          next: [],
          previous: [],
          first: [],
          last: [],
          start: [],
          up: [],
          search: [
            {
              url: 'https://storage.googleapis.com/search%20function%20link',
              title: undefined,
              type: 'application/opds+json',
              rel: 'search',
              duration: undefined,
            },
          ],
          bookshelf: [],
          text: [],
          self: [
            {
              url: 'https://storage.googleapis.com/audiobook_edrlab/feed.json',
              title: undefined,
              type: 'application/opds+json',
              rel: 'self',
              duration: undefined,
            },
          ],
        },
        groups: [
          {
            publications: [
              {
                baseUrl: 'https://storage.googleapis.com/',
                r2OpdsPublicationBase64:
                  'eyJtZXRhZGF0YSI6eyJAdHlwZSI6Imh0dHA6Ly9zY2hlbWEub3JnL0F1ZGlvYm9vayIsInRpdGxlIjoiTCdhc3NvbW1vaXIiLCJpZGVudGlmaWVyIjoiYXNzb21tb2lyX2VtaWxlX3pvbGEiLCJhdXRob3IiOiJFbWlsZSBab2xhIiwicHVibGlzaGVyIjoiYXJjaGl2ZSIsImxhbmd1YWdlIjoiZnIiLCJkZXNjcmlwdGlvbiI6IkwnQXNzb21tb2lyIGVzdCB1biByb21hbiBkJ8OJbWlsZSBab2xhIHB1Ymxpw6kgZW4gZmV1aWxsZXRvbiBkw6hzIDE4NzYgZGFucyBMZSBCaWVuIHB1YmxpYywgcHVpcyBkYW5zIExhIFLDqXB1YmxpcXVlIGRlcyBMZXR0cmVzLCBhdmFudCBzYSBzb3J0aWUgZW4gbGl2cmUgZW4gMTg3NyBjaGV6IGwnw6lkaXRldXIgR2VvcmdlcyBDaGFycGVudGllci4gQydlc3QgbGUgc2VwdGnDqG1lIHZvbHVtZSBkZSBsYSBzw6lyaWUgTGVzIFJvdWdvbi1NYWNxdWFydC4iLCJkdXJhdGlvbiI6NjE2NjQsInJpZ2h0cyI6IiIsInN1YmplY3QiOiJyb21hbiJ9LCJsaW5rcyI6W3sidHlwZSI6ImFwcGxpY2F0aW9uL29wZHMtcHVibGljYXRpb24ranNvbiIsInJlbCI6InNlbGYiLCJocmVmIjoiaHR0cHM6Ly9zdG9yYWdlLmdvb2dsZWFwaXMuY29tL2F1ZGlvYm9va19lZHJsYWIvb3Bkc3B1Yi9hc3NvbW1vaXJfZW1pbGVfem9sYS5qc29uIn0seyJ0eXBlIjoiYXBwbGljYXRpb24vd2VicHViK2pzb24iLCJyZWwiOiJodHRwOi8vb3Bkcy1zcGVjLm9yZy9hY3F1aXNpdGlvbi9vcGVuLWFjY2VzcyIsImhyZWYiOiJodHRwczovL3N0b3JhZ2UuZ29vZ2xlYXBpcy5jb20vYXVkaW9ib29rX2VkcmxhYi93ZWJwdWIvYXNzb21tb2lyX2VtaWxlX3pvbGEuanNvbiJ9XSwiaW1hZ2VzIjpbeyJ0eXBlIjoiaW1hZ2UvanBlZyIsImhyZWYiOiJodHRwczovL2lhNjAwMjAwLnVzLmFyY2hpdmUub3JnLzgvaXRlbXMvTEFzc29tbW9pci9fX2lhX3RodW1iLmpwZyJ9XX0=',
                title: "L'assommoir",
                authors: [{name: 'Emile Zola', link: []}],
                publishers: [{name: 'archive', link: []}],
                workIdentifier: 'assommoir_emile_zola',
                numberOfPages: undefined,
                description:
                  "L'Assommoir est un roman d'Émile Zola publié en feuilleton dès 1876 dans Le Bien public, puis dans La République des Lettres, avant sa sortie en livre en 1877 chez l'éditeur Georges Charpentier. C'est le septième volume de la série Les Rougon-Macquart.",
                tags: [{name: 'roman', link: []}],
                languages: ['fr'],
                publishedAt: undefined,
                cover: {
                  thumbnailLinks: [
                    {
                      url:
                        'https://ia600200.us.archive.org/8/items/LAssommoir/__ia_thumb.jpg',
                      title: undefined,
                      type: 'image/jpeg',
                      rel: undefined,
                      duration: undefined,
                    },
                  ],
                  coverLinks: [],
                },
                entryLinks: [
                  {
                    url:
                      'https://storage.googleapis.com/audiobook_edrlab/opdspub/assommoir_emile_zola.json',
                    title: undefined,
                    type: 'application/opds-publication+json',
                    rel: 'self',
                    duration: undefined,
                  },
                ],
                buyLinks: [],
                borrowLinks: [],
                subscribeLinks: [],
                sampleOrPreviewLinks: [],
                openAccessLinks: [
                  {
                    url:
                      'https://storage.googleapis.com/audiobook_edrlab/webpub/assommoir_emile_zola.json',
                    title: undefined,
                    type: 'application/webpub+json',
                    rel: 'http://opds-spec.org/acquisition/open-access',
                    duration: undefined,
                  },
                ],
                revokeLoanLinks: [],
              },
              {
                baseUrl: 'https://storage.googleapis.com/',
                r2OpdsPublicationBase64:
                  'eyJtZXRhZGF0YSI6eyJAdHlwZSI6Imh0dHA6Ly9zY2hlbWEub3JnL0F1ZGlvYm9vayIsInRpdGxlIjoiRHUgY29udHJhdCBzb2NpYWwiLCJpZGVudGlmaWVyIjoiZHVfY29udHJhdF9zb2NpYWxfcm91c3NlYXUiLCJhdXRob3IiOiJSb3Vzc2VhdSIsInB1Ymxpc2hlciI6ImFyY2hpdmUiLCJsYW5ndWFnZSI6ImZyIiwiZGVzY3JpcHRpb24iOiJEdSBjb250cmF0IHNvY2lhbCBvdSBQcmluY2lwZXMgZHUgZHJvaXQgcG9saXRpcXVlIGVzdCB1biBvdXZyYWdlIGRlIHBoaWxvc29waGllIHBvbGl0aXF1ZSBwZW5zw6kgZXQgw6ljcml0IHBhciBKZWFuLUphY3F1ZXMgUm91c3NlYXUsIHB1Ymxpw6kgZW4gMTc2Mi4gTCfFk3V2cmUgYSBjb25zdGl0dcOpIHVuIHRvdXJuYW50IGTDqWNpc2lmIHBvdXIgbGEgbW9kZXJuaXTDqSBldCBzJ2VzdCBpbXBvc8OpZSBjb21tZSB1biBkZXMgdGV4dGVzIG1hamV1cnMgZGUgbGEgcGhpbG9zb3BoaWUgcG9saXRpcXVlIGV0IHNvY2lhbGUsIGVuIGFmZmlybWFudCBsZSBwcmluY2lwZSBkZSBzb3V2ZXJhaW5ldMOpIGR1IHBldXBsZSBhcHB1ecOpIHN1ciBsZXMgbm90aW9ucyBkZSBsaWJlcnTDqSwgZCfDqWdhbGl0w6ksIGV0IGRlIHZvbG9udMOpIGfDqW7DqXJhbGUuICIsImR1cmF0aW9uIjoxNDEyNywicmlnaHRzIjoiIiwic3ViamVjdCI6ImVzc2FpIn0sImxpbmtzIjpbeyJ0eXBlIjoiYXBwbGljYXRpb24vb3Bkcy1wdWJsaWNhdGlvbitqc29uIiwicmVsIjoic2VsZiIsImhyZWYiOiJodHRwczovL3N0b3JhZ2UuZ29vZ2xlYXBpcy5jb20vYXVkaW9ib29rX2VkcmxhYi9vcGRzcHViL2R1X2NvbnRyYXRfc29jaWFsX3JvdXNzZWF1Lmpzb24ifSx7InR5cGUiOiJhcHBsaWNhdGlvbi93ZWJwdWIranNvbiIsInJlbCI6Imh0dHA6Ly9vcGRzLXNwZWMub3JnL2FjcXVpc2l0aW9uL29wZW4tYWNjZXNzIiwiaHJlZiI6Imh0dHBzOi8vc3RvcmFnZS5nb29nbGVhcGlzLmNvbS9hdWRpb2Jvb2tfZWRybGFiL3dlYnB1Yi9kdV9jb250cmF0X3NvY2lhbF9yb3Vzc2VhdS5qc29uIn1dLCJpbWFnZXMiOlt7InR5cGUiOiJpbWFnZS9qcGVnIiwiaHJlZiI6Imh0dHBzOi8vdXBsb2FkLndpa2ltZWRpYS5vcmcvd2lraXBlZGlhL2NvbW1vbnMvZC9kYi9Tb2NpYWxfY29udHJhY3Rfcm91c3NlYXVfcGFnZS5qcGcifV19',
                title: 'Du contrat social',
                authors: [{name: 'Rousseau', link: []}],
                publishers: [{name: 'archive', link: []}],
                workIdentifier: 'du_contrat_social_rousseau',
                numberOfPages: undefined,
                description:
                  "Du contrat social ou Principes du droit politique est un ouvrage de philosophie politique pensé et écrit par Jean-Jacques Rousseau, publié en 1762. L'œuvre a constitué un tournant décisif pour la modernité et s'est imposée comme un des textes majeurs de la philosophie politique et sociale, en affirmant le principe de souveraineté du peuple appuyé sur les notions de liberté, d'égalité, et de volonté générale. ",
                tags: [{name: 'essai', link: []}],
                languages: ['fr'],
                publishedAt: undefined,
                cover: {
                  thumbnailLinks: [
                    {
                      url:
                        'https://upload.wikimedia.org/wikipedia/commons/d/db/Social_contract_rousseau_page.jpg',
                      title: undefined,
                      type: 'image/jpeg',
                      rel: undefined,
                      duration: undefined,
                    },
                  ],
                  coverLinks: [],
                },
                entryLinks: [
                  {
                    url:
                      'https://storage.googleapis.com/audiobook_edrlab/opdspub/du_contrat_social_rousseau.json',
                    title: undefined,
                    type: 'application/opds-publication+json',
                    rel: 'self',
                    duration: undefined,
                  },
                ],
                buyLinks: [],
                borrowLinks: [],
                subscribeLinks: [],
                sampleOrPreviewLinks: [],
                openAccessLinks: [
                  {
                    url:
                      'https://storage.googleapis.com/audiobook_edrlab/webpub/du_contrat_social_rousseau.json',
                    title: undefined,
                    type: 'application/webpub+json',
                    rel: 'http://opds-spec.org/acquisition/open-access',
                    duration: undefined,
                  },
                ],
                revokeLoanLinks: [],
              },
            ],
            navigation: undefined,
            selfLink: {
              title: 'popular audiobooks',
              subtitle: undefined,
              url:
                'https://storage.googleapis.com/audiobook_edrlab/groups/popular.json',
              numberOfItems: 2,
            },
          },
        ],
        facets: undefined,
        auth: undefined,
      },
      view
    );
  });
});
