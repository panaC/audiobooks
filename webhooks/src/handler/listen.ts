import {Media} from '@assistant/conversation';
import {
  MediaType,
  OptionalMediaControl,
} from '@assistant/conversation/dist/api/schema';
import {ok} from 'assert';
import {TAppService} from '..';

export default function (app: TAppService) {
  app.handle('listen_ask_yes', async conv => {
    const url = app.storage.session.listen_publication?.webpuburl;
    const playerStorage = app.storage.store.player;
    if (playerStorage && url) {
      app.storage.session.player_startIndex = playerStorage[url]?.i;
      app.storage.session.player_startTime = playerStorage[url]?.t;
    }
  });

  app.handle('listen_publication_start', async conv => {
    const pub = app.storage.session.listen_publication;
    ok(pub);

    const webpub = await app.opds.webpubRequest(pub.webpuburl);

    const startIndexRaw = app.storage.session.player_startIndex;
    const startIndex =
      typeof startIndexRaw === 'number' &&
      startIndexRaw <= webpub.readingOrders.length
        ? startIndexRaw
        : 0;

    const startTimeRaw = app.storage.session.player_startTime;
    const startTime =
      typeof startTimeRaw === 'number' &&
      startTimeRaw <= (webpub.readingOrders[startIndex].duration || Infinity)
        ? startTimeRaw
        : 0;

    conv.add(
      new Media({
        mediaObjects: webpub.readingOrders
          .map((v, i) => ({
            name: `${webpub?.title || ''} - ${i + 1}`,
            url: v.url,
            image: {
              large: {
                alt: webpub?.title,
                url: webpub.cover || '',
              },
            },
          }))
          .slice(startIndex),
        mediaType: MediaType.Audio,
        optionalMediaControls: [
          OptionalMediaControl.Paused,
          OptionalMediaControl.Stopped,
        ],
        startOffset: `${startTime}s`,
      })
    );

    // reset previous state
    delete app.storage.session.query_publicationsList;
  });
}
