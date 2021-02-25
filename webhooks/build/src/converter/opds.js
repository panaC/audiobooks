"use strict";
// ==LICENSE-BEGIN==
// Copyright 2017 European Digital Reading Lab. All rights reserved.
// Licensed to the Readium Foundation under one or more contributor license agreements.
// Use of this source code is governed by a BSD-style license
// that can be found in the LICENSE file exposed on Github (readium) in the project repository.
// ==LICENSE-END==
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpdsFeedViewConverter = void 0;
const moment = require("moment");
const localisation_1 = require("./tools/localisation");
const contentType_1 = require("../utils/contentType");
const serializable_1 = require("@r2-lcp-js/serializable");
const opds2_link_1 = require("@r2-opds-js/opds/opds2/opds2-link");
const opds2_properties_1 = require("@r2-opds-js/opds/opds2/opds2-properties");
const fallback_1 = require("./tools/fallback");
const filterLink_1 = require("./tools/filterLink");
const resolveUrl_1 = require("./tools/resolveUrl");
const init_globals_1 = require("@r2-opds-js/opds/init-globals");
init_globals_1.initGlobalConverters_GENERIC();
init_globals_1.initGlobalConverters_OPDS();
const debug = console.log;
const supportedFileTypeLinkArray = [
    contentType_1.ContentType.AudioBookPacked,
    contentType_1.ContentType.AudioBookPackedLcp,
    contentType_1.ContentType.Epub,
    contentType_1.ContentType.Lcp,
    contentType_1.ContentType.AudioBook,
    contentType_1.ContentType.webpub,
    contentType_1.ContentType.webpubPacked,
    contentType_1.ContentType.Json,
    contentType_1.ContentType.JsonLd,
    contentType_1.ContentType.pdf,
    contentType_1.ContentType.lcppdf,
];
class OpdsFeedViewConverter {
    convertOpdsNavigationLinkToView(link, baseUrl) {
        var _a, _b, _c;
        // Title could be defined on multiple lines
        // Only keep the first one
        const titleParts = (_a = link.Title) === null || _a === void 0 ? void 0 : _a.split("\n").filter((text) => text);
        const title = ((_b = titleParts[0]) === null || _b === void 0 ? void 0 : _b.trim()) || "";
        const subtitle = (_c = titleParts[1]) === null || _c === void 0 ? void 0 : _c.trim();
        return {
            title,
            subtitle,
            url: resolveUrl_1.urlPathResolve(baseUrl, link.Href),
            numberOfItems: link.Properties && link.Properties.NumberOfItems,
        };
    }
    convertOpdsTagToView(subject, baseUrl) {
        return (subject.Name || subject.Code) ? {
            name: localisation_1.convertMultiLangStringToString(subject.Name || subject.Code),
            link: this.convertFilterLinksToView(baseUrl, subject.Links || [], {
                type: [
                    contentType_1.ContentType.AtomXml,
                    contentType_1.ContentType.Opds2,
                ],
            }),
        } : undefined;
    }
    convertOpdsContributorToView(contributor, baseUrl) {
        return (contributor.Name) ? {
            name: typeof contributor.Name === "object"
                ? localisation_1.convertMultiLangStringToString(contributor.Name)
                : contributor.Name,
            link: this.convertFilterLinksToView(baseUrl, contributor.Links || [], {
                type: [
                    contentType_1.ContentType.AtomXml,
                    contentType_1.ContentType.Opds2,
                ],
            }),
        } : undefined;
    }
    convertLinkToView(ln, baseUrl) {
        // transform to absolute url
        ln.Href = resolveUrl_1.urlPathResolve(baseUrl, ln.Href);
        // safe copy on each filtered links
        return {
            url: ln.Href,
            title: ln.Title,
            type: ln.TypeLink,
            rel: ln.Rel && ln.Rel.length > 0 ? ln.Rel[0] : undefined,
            duration: ln.Duration,
        };
    }
    filterLinks(links, filter) {
        const linksFiltered = links === null || links === void 0 ? void 0 : links.filter((ln) => {
            var _a, _b, _c;
            if (!ln.Href &&
                ((_a = ln.AdditionalJSON) === null || _a === void 0 ? void 0 : _a.link) &&
                typeof ((_b = ln.AdditionalJSON) === null || _b === void 0 ? void 0 : _b.link) === "string") {
                // yep, error in OPDS feed, "link" instead of "href"
                ln.Href = (_c = ln.AdditionalJSON) === null || _c === void 0 ? void 0 : _c.link;
                debug(`OPDS LINK MONKEY PATCH: ${ln.Href}`);
            }
            let relFlag = false;
            let typeFlag = false;
            if (ln.Href) {
                relFlag = filterLink_1.filterRelLink(ln, filter);
                typeFlag = filterLink_1.filterTypeLink(ln, filter);
            }
            return ((filter.type && filter.rel)
                ? (relFlag && typeFlag)
                : (relFlag || typeFlag));
        });
        return linksFiltered || [];
    }
    convertFilterLinksToView(baseUrl, links, filter) {
        const lns = this.filterLinks(links, filter);
        const view = lns.map((item) => this.convertLinkToView(item, baseUrl));
        return view;
    }
    // warning: modifies r2OpdsPublication, makes relative URLs absolute with baseUrl!
    convertOpdsPublicationToView(r2OpdsPublication, baseUrl) {
        var _a, _b, _c;
        const metadata = r2OpdsPublication.Metadata;
        const numberOfPages = metadata.NumberOfPages;
        const workIdentifier = metadata.Identifier;
        const description = metadata.Description;
        const languages = metadata.Language;
        const title = localisation_1.convertMultiLangStringToString(metadata.Title);
        const publishedAt = metadata.PublicationDate &&
            moment(metadata.PublicationDate).toISOString();
        const authors = (_a = metadata.Author) === null || _a === void 0 ? void 0 : _a.map((author) => this.convertOpdsContributorToView(author, baseUrl)).filter((v) => !!v);
        const publishers = (_b = metadata.Publisher) === null || _b === void 0 ? void 0 : _b.map((publisher) => this.convertOpdsContributorToView(publisher, baseUrl)).filter((v) => !!v);
        const tags = (_c = metadata.Subject) === null || _c === void 0 ? void 0 : _c.map((subject) => this.convertOpdsTagToView(subject, baseUrl)).filter((v) => !!v);
        // CoverView object
        const coverLinkView = this.convertFilterLinksToView(baseUrl, r2OpdsPublication.Images, {
            rel: "http://opds-spec.org/image",
        });
        const thumbnailLinkView = fallback_1.fallback(this.convertFilterLinksToView(baseUrl, r2OpdsPublication.Images, {
            type: ["image/png", "image/jpeg"],
            rel: "http://opds-spec.org/image/thumbnail",
        }), this.convertFilterLinksToView(baseUrl, r2OpdsPublication.Images, {
            type: ["image/png", "image/jpeg"],
        }), this.convertFilterLinksToView(baseUrl, r2OpdsPublication.Images, {
            type: new RegExp("^image\/*"),
        }));
        let cover;
        if (thumbnailLinkView) {
            cover = {
                thumbnailLinks: thumbnailLinkView,
                coverLinks: coverLinkView,
            };
        }
        // Get opds entry
        const sampleLinkView = this.convertFilterLinksToView(baseUrl, r2OpdsPublication.Links, {
            rel: [
                "http://opds-spec.org/acquisition/sample",
                "http://opds-spec.org/acquisition/preview",
            ],
            type: supportedFileTypeLinkArray,
        });
        const acquisitionLinkView = this.convertFilterLinksToView(baseUrl, r2OpdsPublication.Links, {
            rel: [
                "http://opds-spec.org/acquisition",
                "http://opds-spec.org/acquisition/open-access",
            ],
            type: supportedFileTypeLinkArray,
        });
        const buyLinkView = this.convertFilterLinksToView(baseUrl, r2OpdsPublication.Links, {
            rel: "http://opds-spec.org/acquisition/buy",
        });
        const borrowLinkView = this.convertFilterLinksToView(baseUrl, r2OpdsPublication.Links, {
            rel: "http://opds-spec.org/acquisition/borrow",
        });
        const subscribeLinkView = this.convertFilterLinksToView(baseUrl, r2OpdsPublication.Links, {
            rel: "http://opds-spec.org/acquisition/subscribe",
        });
        const entrylinkView = fallback_1.fallback(this.convertFilterLinksToView(baseUrl, r2OpdsPublication.Links, {
            type: "type=entry;profile=opds-catalog",
            rel: "alternate",
        }), this.convertFilterLinksToView(baseUrl, r2OpdsPublication.Links, {
            type: contentType_1.ContentType.Opds2Pub,
            rel: "self",
        }), this.convertFilterLinksToView(baseUrl, r2OpdsPublication.Links, {
            type: [
                contentType_1.ContentType.AtomXml,
                contentType_1.ContentType.Opds2,
            ],
        }));
        const revokeLoanLinkView = this.convertFilterLinksToView(baseUrl, r2OpdsPublication.Links, {
            rel: ["http://librarysimplified.org/terms/rel/revoke"],
        });
        const r2OpdsPublicationJson = serializable_1.TaJsonSerialize(r2OpdsPublication);
        const r2OpdsPublicationStr = JSON.stringify(r2OpdsPublicationJson);
        const r2OpdsPublicationBase64 = Buffer.from(r2OpdsPublicationStr).toString("base64");
        return {
            baseUrl,
            r2OpdsPublicationBase64,
            title,
            authors,
            publishers,
            workIdentifier,
            numberOfPages,
            description,
            tags,
            languages,
            publishedAt,
            cover,
            entryLinks: entrylinkView,
            buyLinks: buyLinkView,
            borrowLinks: borrowLinkView,
            subscribeLinks: subscribeLinkView,
            sampleOrPreviewLinks: sampleLinkView,
            openAccessLinks: acquisitionLinkView,
            revokeLoanLinks: revokeLoanLinkView,
        };
    }
    convertOpdsAuthToView(r2OpdsAuth, baseUrl) {
        const title = r2OpdsAuth.Title;
        let logoImageUrl = "";
        const logoLink = r2OpdsAuth.Links.find((l) => l.Rel && l.Rel.includes("logo"));
        if (logoLink) {
            logoImageUrl = resolveUrl_1.urlPathResolve(baseUrl, logoLink.Href);
        }
        const oauth = r2OpdsAuth.Authentication.find((a) => a.Type === "http://opds-spec.org/auth/oauth/password");
        let labelLogin = "";
        let labelPassword = "";
        let oauthUrl = "";
        let oauthRefreshUrl = "";
        if (oauth) {
            if (oauth.Labels) {
                labelLogin = oauth.Labels.Login;
                labelPassword = oauth.Labels.Password;
            }
            if (oauth.Links) {
                const oauthLink = oauth.Links.find((l) => l.Rel && l.Rel.includes("authenticate"));
                if (oauthLink) {
                    oauthUrl = resolveUrl_1.urlPathResolve(baseUrl, oauthLink.Href);
                }
                const oauthRefreshLink = oauth.Links.find((l) => l.Rel && l.Rel.includes("refresh"));
                if (oauthRefreshLink) {
                    oauthRefreshUrl = resolveUrl_1.urlPathResolve(baseUrl, oauthRefreshLink.Href);
                }
            }
        }
        const auth = {
            logoImageUrl,
            labelLogin,
            labelPassword,
            oauthUrl,
            oauthRefreshUrl,
        };
        return {
            title,
            metadata: undefined,
            publications: [],
            navigation: undefined,
            links: undefined,
            groups: undefined,
            auth,
        };
    }
    convertOpdsGroupToView(r2OpdsGroup, baseUrl) {
        var _a, _b, _c, _d;
        const publications = (_a = r2OpdsGroup.Publications) === null || _a === void 0 ? void 0 : _a.map((item) => 
        // warning: modifies item, makes relative URLs absolute with baseUrl!
        this.convertOpdsPublicationToView(item, baseUrl));
        const navigation = (_b = r2OpdsGroup.Navigation) === null || _b === void 0 ? void 0 : _b.map((item) => this.convertOpdsNavigationLinkToView(item, baseUrl));
        const [lnFiltered] = this.filterLinks(r2OpdsGroup.Links, {
            rel: "self",
        });
        const title = ((_c = r2OpdsGroup.Metadata) === null || _c === void 0 ? void 0 : _c.Title)
            ? localisation_1.convertMultiLangStringToString(r2OpdsGroup.Metadata.Title)
            : "";
        const nb = (_d = r2OpdsGroup.Metadata) === null || _d === void 0 ? void 0 : _d.NumberOfItems;
        const selfLink = new opds2_link_1.OPDSLink();
        selfLink.Title = title;
        selfLink.Properties = new opds2_properties_1.OPDSProperties();
        selfLink.Properties.NumberOfItems = nb;
        selfLink.Rel = (lnFiltered === null || lnFiltered === void 0 ? void 0 : lnFiltered.Rel) || undefined;
        selfLink.Href = lnFiltered === null || lnFiltered === void 0 ? void 0 : lnFiltered.Href;
        const ret = {
            publications,
            navigation,
            selfLink: this.convertOpdsNavigationLinkToView(selfLink, baseUrl),
        };
        return ret;
    }
    convertOpdsFacetsToView(r2OpdsFacet, baseUrl) {
        var _a, _b;
        const title = ((_a = r2OpdsFacet.Metadata) === null || _a === void 0 ? void 0 : _a.Title)
            ? localisation_1.convertMultiLangStringToString(r2OpdsFacet.Metadata.Title)
            : "";
        const links = (_b = r2OpdsFacet.Links) === null || _b === void 0 ? void 0 : _b.map((item) => this.convertOpdsNavigationLinkToView(item, baseUrl));
        const ret = {
            title,
            links,
        };
        return ret;
    }
    convertOpdsFeedToView(r2OpdsFeed, baseUrl) {
        var _a, _b, _c, _d, _e;
        const title = localisation_1.convertMultiLangStringToString((_a = r2OpdsFeed.Metadata) === null || _a === void 0 ? void 0 : _a.Title);
        const publications = (_b = r2OpdsFeed.Publications) === null || _b === void 0 ? void 0 : _b.map((item) => 
        // warning: modifies item, makes relative URLs absolute with baseUrl!
        this.convertOpdsPublicationToView(item, baseUrl));
        const navigation = (_c = r2OpdsFeed.Navigation) === null || _c === void 0 ? void 0 : _c.map((item) => this.convertOpdsNavigationLinkToView(item, baseUrl));
        const groups = (_d = r2OpdsFeed.Groups) === null || _d === void 0 ? void 0 : _d.map((item) => this.convertOpdsGroupToView(item, baseUrl));
        const facets = (_e = r2OpdsFeed.Facets) === null || _e === void 0 ? void 0 : _e.map((item) => this.convertOpdsFacetsToView(item, baseUrl));
        const links = r2OpdsFeed.Links &&
            {
                next: this.convertFilterLinksToView(baseUrl, r2OpdsFeed.Links, { rel: "next" }),
                previous: this.convertFilterLinksToView(baseUrl, r2OpdsFeed.Links, { rel: "previous" }),
                first: this.convertFilterLinksToView(baseUrl, r2OpdsFeed.Links, { rel: "first" }),
                last: this.convertFilterLinksToView(baseUrl, r2OpdsFeed.Links, { rel: "last" }),
                start: this.convertFilterLinksToView(baseUrl, r2OpdsFeed.Links, { rel: "start" }),
                up: this.convertFilterLinksToView(baseUrl, r2OpdsFeed.Links, { rel: "up" }),
                search: this.convertFilterLinksToView(baseUrl, r2OpdsFeed.Links, { rel: "search" }),
                bookshelf: this.convertFilterLinksToView(baseUrl, r2OpdsFeed.Links, { rel: "http://opds-spec.org/shelf" }),
                text: this.convertFilterLinksToView(baseUrl, r2OpdsFeed.Links, { type: [contentType_1.ContentType.Html] }),
                self: this.convertFilterLinksToView(baseUrl, r2OpdsFeed.Links, { rel: "self" }),
            };
        const metadata = r2OpdsFeed.Metadata ?
            {
                numberOfItems: typeof r2OpdsFeed.Metadata.NumberOfItems === "number" ?
                    r2OpdsFeed.Metadata.NumberOfItems : undefined,
                itemsPerPage: typeof r2OpdsFeed.Metadata.ItemsPerPage === "number" ?
                    r2OpdsFeed.Metadata.ItemsPerPage : undefined,
                currentPage: typeof r2OpdsFeed.Metadata.CurrentPage === "number" ?
                    r2OpdsFeed.Metadata.CurrentPage : undefined
            } : undefined;
        return {
            title,
            metadata,
            publications,
            navigation,
            links,
            groups,
            facets,
            auth: undefined,
        };
    }
}
exports.OpdsFeedViewConverter = OpdsFeedViewConverter;
//# sourceMappingURL=opds.js.map