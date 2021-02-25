import { IOpdsGroupView, IOpdsLinkView, IOpdsNavigationLinkView, IOpdsPublicationView, IOpdsResultView, IOpdsTagView, IOpdsContributorView, IOpdsFacetView } from "../interface/opds";
import { OPDSFeed } from "@r2-opds-js/opds/opds2/opds2";
import { OPDSAuthenticationDoc } from "@r2-opds-js/opds/opds2/opds2-authentication-doc";
import { OPDSFacet } from "@r2-opds-js/opds/opds2/opds2-facet";
import { OPDSGroup } from "@r2-opds-js/opds/opds2/opds2-group";
import { OPDSLink } from "@r2-opds-js/opds/opds2/opds2-link";
import { OPDSPublication } from "@r2-opds-js/opds/opds2/opds2-publication";
import { Contributor } from "@r2-shared-js/models/metadata-contributor";
import { Subject } from "@r2-shared-js/models/metadata-subject";
import { TLinkMayBeOpds } from "./type/link.type";
import { ILinkFilter } from "./type/linkFilter.interface";
export declare class OpdsFeedViewConverter {
    convertOpdsNavigationLinkToView(link: OPDSLink, baseUrl: string): IOpdsNavigationLinkView;
    convertOpdsTagToView(subject: Subject, baseUrl: string): IOpdsTagView | undefined;
    convertOpdsContributorToView(contributor: Contributor, baseUrl: string): IOpdsContributorView | undefined;
    convertLinkToView(ln: TLinkMayBeOpds, baseUrl: string): IOpdsLinkView;
    filterLinks(links: TLinkMayBeOpds[] | undefined, filter: ILinkFilter): TLinkMayBeOpds[];
    convertFilterLinksToView(baseUrl: string, links: TLinkMayBeOpds[] | undefined, filter: ILinkFilter): IOpdsLinkView[];
    convertOpdsPublicationToView(r2OpdsPublication: OPDSPublication, baseUrl: string): IOpdsPublicationView;
    convertOpdsAuthToView(r2OpdsAuth: OPDSAuthenticationDoc, baseUrl: string): IOpdsResultView;
    convertOpdsGroupToView(r2OpdsGroup: OPDSGroup, baseUrl: string): IOpdsGroupView;
    convertOpdsFacetsToView(r2OpdsFacet: OPDSFacet, baseUrl: string): IOpdsFacetView;
    convertOpdsFeedToView(r2OpdsFeed: OPDSFeed, baseUrl: string): IOpdsResultView;
}
