"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpdsService = void 0;
const contentType_1 = require("../utils/contentType");
const serializable_1 = require("r2-lcp-js/dist/es6-es2015/src/serializable");
const opds2_publication_1 = require("r2-opds-js/dist/es6-es2015/src/opds/opds2/opds2-publication");
const di_1 = require("../di");
const opds2_1 = require("r2-opds-js/dist/es6-es2015/src/opds/opds2/opds2");
const publication_1 = require("@r2-shared-js/models/publication");
const http_1 = require("../utils/http");
const node_assert_1 = require("node:assert");
const debug = console.log;
class OpdsService {
    async opdsRequest(url) {
        const res = await http_1.httpFetchFormattedResponse(url, undefined, async (opdsData) => {
            var _a;
            const { url: _baseUrl, responseUrl, contentType: _contentType } = opdsData;
            const baseUrl = `${_baseUrl}`;
            const contentType = contentType_1.parseContentType(_contentType || "");
            if (contentType_1.contentTypeisOpds(contentType)) {
                const json = await ((_a = opdsData.response) === null || _a === void 0 ? void 0 : _a.json());
                opdsData.data = await this.opdsRequestJsonTransformer(json || {}, contentType, baseUrl);
            }
            return opdsData;
        });
        node_assert_1.ok(res.data, "opds request error");
        return res.data;
    }
    async webpubRequest(url) {
        const res = await http_1.httpFetchFormattedResponse(url, undefined, async (webpubData) => {
            var _a;
            const { url: _baseUrl, responseUrl, contentType: _contentType } = webpubData;
            const baseUrl = `${_baseUrl}`;
            const contentType = contentType_1.parseContentType(_contentType || "");
            if (contentType === contentType_1.ContentType.webpub || contentType === contentType_1.ContentType.Json || contentType === contentType_1.ContentType.JsonLd) {
                const jsonObj = await ((_a = webpubData.response) === null || _a === void 0 ? void 0 : _a.json());
                const isR2Pub = contentType === contentType_1.ContentType.webpub ||
                    jsonObj.metadata &&
                        jsonObj["@context"] === "https://readium.org/webpub-manifest/context.jsonld" &&
                        !!(!jsonObj.publications &&
                            !jsonObj.navigation &&
                            !jsonObj.groups &&
                            !jsonObj.catalogs);
                if (isR2Pub) {
                    const r2Publication = serializable_1.TaJsonDeserialize(jsonObj, publication_1.Publication);
                    webpubData.data = di_1.webpubViewConverter.convertWebpubToView(r2Publication, baseUrl);
                }
            }
            return webpubData;
        });
        node_assert_1.ok(res.data, "webpub request error");
        return res.data;
    }
    async opdsRequestJsonTransformer(jsonObj, contentType, 
    // responseUrl: string,
    url) {
        const baseUrl = url;
        const isOpdsPub = contentType === contentType_1.ContentType.Opds2Pub ||
            jsonObj.metadata &&
                // jsonObj.links &&
                !!(!jsonObj.publications &&
                    !jsonObj.navigation &&
                    !jsonObj.groups &&
                    !jsonObj.catalogs);
        const isR2Pub = contentType === contentType_1.ContentType.webpub ||
            jsonObj.metadata &&
                jsonObj["@context"] === "https://readium.org/webpub-manifest/context.jsonld" &&
                !!(!jsonObj.publications &&
                    !jsonObj.navigation &&
                    !jsonObj.groups &&
                    !jsonObj.catalogs);
        const isAuth = contentType_1.contentTypeisOpdsAuth(contentType) ||
            typeof jsonObj.authentication !== "undefined";
        const isFeed = contentType === contentType_1.ContentType.Opds2 ||
            !!(jsonObj.publications ||
                jsonObj.navigation ||
                jsonObj.groups ||
                jsonObj.catalogs);
        debug("isAuth, isOpdsPub, isR2Pub, isFeed", isAuth, isOpdsPub, isR2Pub, isFeed);
        if (isAuth) {
            // not implemeted 
            debug("auth not implemented");
            // const r2OpdsAuth = TaJsonDeserialize(
            //     jsonObj,
            //     OPDSAuthenticationDoc,
            // );
            // this.dispatchAuthenticationProcess(r2OpdsAuth, responseUrl);
            return {
                title: "Unauthorized",
                publications: [],
            }; // need to refresh the page
        }
        else if (isOpdsPub) {
            const r2OpdsPublication = serializable_1.TaJsonDeserialize(jsonObj, opds2_publication_1.OPDSPublication);
            const pubView = di_1.opdsFeedViewConverter.convertOpdsPublicationToView(r2OpdsPublication, baseUrl);
            return {
                title: pubView.title,
                publications: [pubView],
            };
        }
        else if (isR2Pub) {
            const r2Publication = serializable_1.TaJsonDeserialize(jsonObj, publication_1.Publication);
            const pub = new opds2_publication_1.OPDSPublication();
            if (typeof r2Publication.Metadata === "object") {
                pub.Metadata = r2Publication.Metadata;
            }
            const coverLink = r2Publication.searchLinkByRel("cover");
            if (coverLink) {
                pub.AddImage(coverLink.Href, coverLink.TypeLink, coverLink.Height, coverLink.Width);
            }
            pub.AddLink_(url, "application/webpub+json", "http://opds-spec.org/acquisition/open-access", "");
            const pubView = di_1.opdsFeedViewConverter.convertOpdsPublicationToView(pub, baseUrl);
            return {
                title: pubView.title,
                publications: [pubView],
            };
        }
        else if (isFeed) {
            const r2OpdsFeed = serializable_1.TaJsonDeserialize(jsonObj, opds2_1.OPDSFeed);
            const { title, publications: _pubs } = di_1.opdsFeedViewConverter.convertOpdsFeedToView(r2OpdsFeed, baseUrl);
            return {
                title,
                publications: Array.isArray(_pubs) ? _pubs : [],
            };
        }
        return {
            title: "error",
            publications: [],
        };
    }
}
exports.OpdsService = OpdsService;
//# sourceMappingURL=opds.js.map