export interface IReadingLink {
    duration?: number;
    url: string;
}
export interface IWebPubView {
    identifier: string;
    title: string;
    authors: string[];
    publishers?: string[];
    workIdentifier?: string;
    description?: string;
    tags?: string[];
    languages?: string[];
    publishedAt?: string;
    cover?: string;
    RDFType?: string;
    duration?: number;
    nbOfTracks?: number;
    readingOrders: IReadingLink[];
}
