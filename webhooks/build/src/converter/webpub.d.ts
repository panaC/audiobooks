import { IWebPubView } from "../interface/webpub";
import { Publication as R2Publication } from "@r2-shared-js/models/publication";
export declare class WebpubViewConverter {
    convertWebpubToView(r2Publication: R2Publication, baseUrl: string): IWebPubView;
}
