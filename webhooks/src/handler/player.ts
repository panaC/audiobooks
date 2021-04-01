import { ConversationV3 } from "@assistant/conversation";
import { ok } from "assert";
import { TAppService } from "..";

export default function (app: TAppService) {

  const reset = () => {
    delete app.storage.session.player_publicationUrl;
    delete app.storage.session.player_partIndex;
    delete app.storage.session.player_nbOfPart;
    delete app.storage.session.player_totalTime;
    delete app.storage.session.player_partTime
  }

  const player = (conv: ConversationV3) => {
    const progress = conv.request.context?.media?.progress;
    const index = (conv.request.context?.media as any)?.index;
    ok(typeof progress === "string");
    ok(typeof index === "number");

    app.storage.session.player_partIndex = index;
    app.storage.session.player_partTime = parseInt(progress, 10);

    ok(app.storage.session.player_partIndex <= (app.storage.session.player_nbOfPart || 0), "part index to high")
  }


  app.handle('player_media_status_finished', conv => {

    reset();
  });

  app.handle('player_media_status_failed', conv => {

    reset();
  });

  app.handle('player_media_status_paused', conv => {

    app.log.log(JSON.stringify(conv.request.context?.media))

    player(conv);
    
  });

  app.handle('player_media_status_stopped', conv => {

    app.log.log(JSON.stringify(conv.request.context?.media))

    player(conv);
  });

}