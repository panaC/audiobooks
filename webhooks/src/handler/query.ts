import {ok} from 'assert';
import {URL} from 'url';
import {TAppService} from '..';
import {ContentType} from '../utils/contentType';
import {tryCatch} from '../utils/tryCatch';

export default function (app: TAppService) {

  app.handle('query_search_query', async conv => {
    const q = conv.intent.params?.query.resolved;
    ok(typeof q === 'string');

    const conf = await app.config.get();
    const searchUrl = conf.feed?.search || '';
    ok(new URL(searchUrl));

    const url = searchUrl.replace('{query}', encodeURIComponent(q));

    const {publications} = await app.opds.opdsRequest(url);
    ok(Array.isArray(publications));

    app.storage.session.query_publicationsList = publications
      .filter(({openAccessLinks: l}) /*: l is IOpdsLinkView[]*/ => {
        return (
          Array.isArray(l) &&
          l[0] &&
          (l[0].type === ContentType.AudioBook ||
            l[0].type === ContentType.webpub ||
            l[0].type === ContentType.Json ||
            l[0].type === ContentType.JsonLd) &&
          !!tryCatch(() => new URL(l[0].url))
        );
      })
      .slice(0, 5)
      .map(({title, authors, openAccessLinks}) => ({
        title: title,
        author: authors[0]?.name || "",
        webpuburl: openAccessLinks ? openAccessLinks[0].url : 'never',
      }));

    app.log.log.info(
      `search ${q} in ${url} return ${publications.length} publications`
    );
  });

  app.handle('query_select_publications_list', async conv => {

    const pubs = app.storage.session.query_publicationsList;
    ok(Array.isArray(pubs));
    conv.add(`il y a ${pubs.length} publications :\nPour choisir une publication dite son numéro`);
    let text = "";
    pubs.map(
      ({title, author}, i) => {
        text += `numero ${i + 1} : ${title} ${author ? `de ${author}` : ""}\n`;
      });

    conv.add(text);
  });

  app.handle('query_select_publication_check_number', async conv => {
    const number = conv.intent.params?.number?.resolved;
    ok(typeof number === 'number');
    ok(number > 0 && number < 6, 'number not in range');

    const publications = app.storage.session.query_publicationsList;
    ok(Array.isArray(publications));

    const pub = publications[number - 1];
    app.storage.session.query_publicationsList = [];
    app.storage.session.query_publicationNumberSelected = !!pub;
    app.storage.session.listen_publication = pub;
  });
}