import { OPDSAvailabilityEnum } from "@r2-opds-js/opds/opds2/opds2-availability";
import { OPDSCurrencyEnum } from "@r2-opds-js/opds/opds2/opds2-price";
export interface IOpdsFeedView {
    title: string;
    url: string;
    identifier: string;
}
export interface IOpdsCoverView {
    coverLinks: IOpdsLinkView[];
    thumbnailLinks: IOpdsLinkView[];
}
export interface IOpdsPublicationView {
    baseUrl: string;
    r2OpdsPublicationBase64?: string;
    title: string;
    authors: IOpdsContributorView[];
    publishers?: IOpdsContributorView[];
    workIdentifier?: string;
    description?: string;
    numberOfPages: number;
    tags?: IOpdsTagView[];
    languages?: string[];
    publishedAt?: string;
    entryLinks?: IOpdsLinkView[];
    buyLinks?: IOpdsLinkView[];
    borrowLinks?: IOpdsLinkView[];
    subscribeLinks?: IOpdsLinkView[];
    sampleOrPreviewLinks?: IOpdsLinkView[];
    openAccessLinks?: IOpdsLinkView[];
    revokeLoanLinks?: IOpdsLinkView[];
    cover?: IOpdsCoverView;
}
export interface IOpdsNavigationLinkView {
    title: string;
    subtitle?: string;
    url: string;
    numberOfItems?: number;
}
export interface IOpdsFeedMetadataView {
    numberOfItems?: number;
    itemsPerPage?: number;
    currentPage?: number;
}
export interface IOpdsResultView {
    title: string;
    metadata?: IOpdsFeedMetadataView;
    navigation?: IOpdsNavigationLinkView[];
    publications: IOpdsPublicationView[];
    links?: IOpdsNavigationLink;
    facets?: IOpdsFacetView[];
    groups?: IOpdsGroupView[];
    auth?: IOpdsAuthView;
}
export interface IOpdsGroupView {
    navigation?: IOpdsNavigationLinkView[];
    publications?: IOpdsPublicationView[];
    selfLink: IOpdsNavigationLinkView;
}
export interface IOpdsFacetView {
    title: string;
    links: IOpdsNavigationLinkView[];
}
export interface IOpdsAuthView {
    logoImageUrl: string;
    labelLogin: string;
    labelPassword: string;
    oauthUrl: string;
    oauthRefreshUrl: string;
}
export interface IOPDSPropertiesView {
    indirectAcquisitionType?: string | undefined;
    numberOfItems?: number | undefined;
    priceValue?: number | undefined;
    priceCurrency?: OPDSCurrencyEnum | undefined;
    holdTotal?: number | undefined;
    holdPosition?: number | undefined;
    copyTotal?: number | undefined;
    copyAvailable?: number | undefined;
    availabilityState?: OPDSAvailabilityEnum | undefined;
    availabilitySince?: string | undefined;
    availabilityUntil?: string | undefined;
    lcpHashedPassphrase?: string | undefined;
}
export interface IOpdsBaseLinkView {
    name: string;
    link: IOpdsLinkView[];
}
export interface IOpdsTagView extends IOpdsBaseLinkView {
}
export interface IOpdsContributorView extends IOpdsBaseLinkView {
}
export interface IOpdsLinkView {
    url: string;
    title?: string;
    type?: string;
    properties?: IOPDSPropertiesView;
    duration?: number;
    rel?: string;
}
export interface IOpdsNavigationLink {
    next: IOpdsLinkView[];
    previous: IOpdsLinkView[];
    first: IOpdsLinkView[];
    last: IOpdsLinkView[];
    start: IOpdsLinkView[];
    up: IOpdsLinkView[];
    search: IOpdsLinkView[];
    bookshelf: IOpdsLinkView[];
    text: IOpdsLinkView[];
    self: IOpdsLinkView[];
}
