import {TAppService} from '..';

export default function (app: TAppService) {
  app.handle('read_my_book', conv => {
    // store the last publication read from store to session

    const [url, data] = Object.entries(app.storage.store.player || {}).reduce(
      ([urlFromPv, dataFromPv], [url, data]) => {
        if (data && dataFromPv && data?.d > dataFromPv?.d) {
          return [url, data];
        }
        return [urlFromPv, dataFromPv];
      }
    );

    if (typeof url === 'string' && data) {
      app.storage.session.listen_publication = {
        webpuburl: url,
        title: '',
        author: '',
      };
      app.storage.session.player_startIndex = data.i;
      app.storage.session.player_startTime = data.t;
    } else {
      app.storage.session.state = 'nopub';
    }
  });
}
