import {ConversationV3, Media} from '@assistant/conversation';
import {MediaType} from '@assistant/conversation/dist/api/schema';
import {ok} from 'assert';
import {TAppService} from '..';

export default function (app: TAppService) {
  const reset = () => {
    const url = app.storage.session.listen_publication?.webpuburl;
    if (app.storage.store.player && url) {
      delete app.storage.store.player[url];
    }
    delete app.storage.session.listen_publication;
    delete app.storage.session.state;
  };

  const player = (conv: ConversationV3) => {
    const progress = conv.request.context?.media?.progress;
    const index = (conv.request.context?.media as any)?.index;
    ok(typeof progress === 'string');
    ok(typeof index === 'number');

    if (!app.storage.store.player) {
      app.storage.store.player = {};
    }
    const url = app.storage.session.listen_publication?.webpuburl;
    ok(url);
    app.storage.store.player[url] = {
      i: index,
      t: parseInt(progress, 10),
      d: new Date().getTime(),
    };

    conv.add(
      new Media({
        mediaType: MediaType.MediaStatusACK,
      })
    );
  };

  app.handle('player_media_status_finished', conv => {
    reset();
  });

  app.handle('player_media_status_failed', conv => {
    reset();
  });

  app.handle('player_media_status_paused', conv => {
    app.log.log(JSON.stringify(conv.request.context?.media));

    player(conv);
  });

  app.handle('player_media_status_stopped', conv => {
    app.log.log(JSON.stringify(conv.request.context?.media));

    player(conv);
  });

  app.handle('cancel', conv => {
    console.log('CANCEL PLAYER');

    // save media player on cancel
    player(conv);
  });
}
