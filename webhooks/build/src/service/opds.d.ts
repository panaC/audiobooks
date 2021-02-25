import { IOpdsResultView } from "../interface/opds";
import { IWebPubView } from "../interface/webpub";
export declare class OpdsService {
    opdsRequest(url: string): Promise<IOpdsResultView>;
    webpubRequest(url: string): Promise<IWebPubView>;
    private opdsRequestJsonTransformer;
}
