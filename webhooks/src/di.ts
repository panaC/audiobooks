import { OpdsFeedViewConverter } from "./converter/opds";
import { WebpubViewConverter } from "./converter/webpub";
import { OpdsService } from "./service/opds";


export const opdsFeedViewConverter = new OpdsFeedViewConverter();

export const webpubViewConverter = new WebpubViewConverter();

export const opdsService = new OpdsService();