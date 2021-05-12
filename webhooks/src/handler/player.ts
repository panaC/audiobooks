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

    const time = parseInt(progress, 10);
    app.storage.store.player[url] = {
      i: index,
      t: time,
      d: new Date().getTime(),
    };
    app.storage.session.player_startIndex = index;
    app.storage.session.player_startTime = time;

    conv.add(
      new Media({
        mediaType: MediaType.MediaStatusACK,
      })
    );
  };

  app.handle('player_media_status_finished', conv => {
    reset();

    conv.scene.next = {
      name: 'home',
    };
  });

  app.handle('player_media_status_failed', conv => {
    reset();
    conv.scene.next = {
      name: 'home',
    };
  });

  app.handle('player_media_status_paused', conv => {
    app.log.log(JSON.stringify(conv.request.context?.media));

    player(conv);
  });

  app.handle('player_media_status_stopped', conv => {
    app.log.log(JSON.stringify(conv.request.context?.media));

    player(conv);

    // when stopped go to home ?
    // works ?
    conv.scene.next = {
      name: 'home',
    };
  });

  app.handle('cancel', conv => {
    console.log('CANCEL PLAYER');

    // save media player on cancel
    try {
      player(conv);
    } catch {
      // nop
    }
  });
  app.handle('stop_reading', conv => {
    console.log('CANCEL PLAYER');

    // save media player on cancel
    try {
      player(conv);
    } catch {
      // nop
    }
  });

  app.handle('read_toc', async conv => {
    const pub = app.storage.session.listen_publication;
    ok(pub, 'publication not found');

    const webpub = await app.opds.webpubRequest(pub.webpuburl);
    ok(webpub, 'publication not found');

    const config = await app.config.get();
    let text = '';
    if (Array.isArray(webpub.toc)) {
      webpub.toc.map((l, i) => {
        const title = l.title || '';
        text += app.locale
          .translate(config.locale?.read_toc, 'undefined message')
          .replace('${i}', (i + 1).toString())
          .replace('${title}', title);
      });
    }

    if (!text) {
      text += app.locale.translate(
        config.locale?.read_toc_no_response,
        'undefined message'
      );
    }

    conv.add(text);
    player(conv);
  });

  app.handle('remaining_time', async conv => {
    // ack player and set startIndex and startTime in session
    player(conv);

    const index = app.storage.session.player_startIndex || 0;
    const time = app.storage.session.player_startTime || 0;

    const pub = app.storage.session.listen_publication;
    ok(pub, 'publication not found');

    const webpub = await app.opds.webpubRequest(pub.webpuburl);
    ok(webpub, 'publication not found');

    let minutes = 0;
    if (Array.isArray(webpub.readingOrders)) {
      let remainingTime = 0;
      for (let i = index + 1; i < webpub.readingOrders.length; i += 1)
        remainingTime += webpub.readingOrders[i].duration || 0;
      const pos = (v: number) => (v < 0 ? 0 : v);
      remainingTime += pos((webpub.readingOrders[index].duration || 0) - time);

      if (remainingTime >= 60) {
        minutes = Math.floor(remainingTime / 60);
      }
    }

    const config = await app.config.get();
    const hours = Math.floor(minutes % 60);
    if (hours) {
      minutes = Math.floor(minutes % 60);
      conv.add(
        app.locale
          .translate(config.locale?.remaining_time_hours)
          .replace('${minutes}', minutes.toString())
          .replace('${hours}', hours.toString())
      );
    } else {
      conv.add(
        app.locale
          .translate(config.locale?.remaining_time_minutes)
          .replace('${minutes}', minutes.toString())
      );
    }
  });
}
