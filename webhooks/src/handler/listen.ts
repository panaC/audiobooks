import { Media } from "@assistant/conversation";
import { MediaType, OptionalMediaControl } from "@assistant/conversation/dist/api/schema";
import { ok } from "assert";
import { URL } from "url";
import { TAppService } from "..";

export default function (app: TAppService) {

  app.handle("listen_publication_start", async (conv) => {

    let pub = app.storage.session.listen_publication;
    if (!pub) {
      const list = app.storage.session.query_publicationsList;
      ok(Array.isArray(list));
      pub = app.storage.session.listen_publication = {
        title: list[0]?.title || "",
        author: list[0]?.author || "",
        webpuburl: list[0]?.webpuburl || "",
      }
    }

    ok(pub?.webpuburl, "pub.webpuburl not defined");
    ok(new URL(pub.webpuburl));

    const webpub = await app.opds.webpubRequest(pub.webpuburl);

    app.storage.session.player_publicationUrl = pub.webpuburl;
    app.storage.session.player_partIndex = 0;
    app.storage.session.player_nbOfPart = webpub.readingOrders.length;
    app.storage.session.player_totalTime = webpub.duration || 0;
    app.storage.session.player_partTime = 0;

    conv.add(new Media({
      mediaObjects: webpub.readingOrders.map((v, i) => ({
        name: `${pub?.title || ""} - ${i + 1}`,
        url: v.url,
        image: {
          large: {
            alt: pub?.title,
            url: webpub.cover || "",
          }
        },
      })),
      mediaType: MediaType.Audio,
      optionalMediaControls: [OptionalMediaControl.Paused, OptionalMediaControl.Stopped],
      startOffset: '0s'
    }));

    // reset previous state
    
    delete app.storage.session.query_publicationNumberSelected;
    delete app.storage.session.query_publicationsList;

  });
}