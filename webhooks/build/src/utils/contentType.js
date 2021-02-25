"use strict";
// ==LICENSE-BEGIN==
// Copyright 2017 European Digital Reading Lab. All rights reserved.
// Licensed to the Readium Foundation under one or more contributor license agreements.
// Use of this source code is governed by a BSD-style license
// that can be found in the LICENSE file exposed on Github (readium) in the project repository.
// ==LICENSE-END==
Object.defineProperty(exports, "__esModule", { value: true });
exports.contentTypeisApiProblem = exports.contentTypeisOpdsAuth = exports.contentTypeisOpds = exports.contentTypeisXml = exports.parseContentType = exports.ContentType = void 0;
// cf src/utils/mimeTypes.ts
var ContentType;
(function (ContentType) {
    ContentType["AtomXml"] = "application/atom+xml";
    ContentType["Xml"] = "application/xml";
    ContentType["TextXml"] = "text/xml";
    ContentType["Json"] = "application/json";
    ContentType["JsonLd"] = "application/ld+json";
    ContentType["Opds2"] = "application/opds+json";
    ContentType["Divina"] = "application/divina+json";
    ContentType["DivinaPacked"] = "application/divina+zip";
    ContentType["Opds2Auth"] = "application/opds-authentication+json";
    ContentType["Opds2Pub"] = "application/opds-publication+json";
    ContentType["Opds2AuthVendorV1_0"] = "application/vnd.opds.authentication.v1.0+json";
    ContentType["OpenSearch"] = "application/opensearchdescription+xml";
    ContentType["FormUrlEncoded"] = "application/x-www-form-url-encoded";
    ContentType["Xhtml"] = "application/xhtml+xml";
    ContentType["Html"] = "text/html";
    ContentType["Epub"] = "application/epub+zip";
    ContentType["Lpf"] = "application/lpf+zip";
    ContentType["AudioBook"] = "application/audiobook+json";
    ContentType["webpub"] = "application/webpub+json";
    ContentType["AudioBookPacked"] = "application/audiobook+zip";
    ContentType["AudioBookPackedLcp"] = "application/audiobook+lcp";
    ContentType["webpubPacked"] = "application/webpub+zip";
    ContentType["Lcp"] = "application/vnd.readium.lcp.license.v1.0+json";
    ContentType["Lsd"] = "application/vnd.readium.license.status.v1.0+json";
    ContentType["lcppdf"] = "application/pdf+lcp";
    ContentType["pdf"] = "application/pdf";
    ContentType["ApiProblem"] = "application/api-problem+json";
})(ContentType = exports.ContentType || (exports.ContentType = {}));
const parseContentType = (RawContentType) => {
    if (!RawContentType) {
        return undefined;
    }
    const contentTypeArray = RawContentType.replace(/\s/g, "").split(";");
    const contentType = contentTypeArray.reduce((pv, cv) => pv || Object.values(ContentType).find((v) => v === cv), undefined);
    return contentType;
};
exports.parseContentType = parseContentType;
const contentTypeisXml = (contentType) => contentType && (contentType === ContentType.AtomXml
    || contentType === ContentType.Xml
    || contentType === ContentType.TextXml);
exports.contentTypeisXml = contentTypeisXml;
const contentTypeisOpds = (contentType) => contentType && (contentType === ContentType.Json
    || contentType === ContentType.Opds2
    || contentType === ContentType.Opds2Auth
    || contentType === ContentType.Opds2AuthVendorV1_0
    || contentType === ContentType.Opds2Pub);
exports.contentTypeisOpds = contentTypeisOpds;
const contentTypeisOpdsAuth = (contentType) => contentType === ContentType.Opds2Auth ||
    contentType === ContentType.Opds2AuthVendorV1_0;
exports.contentTypeisOpdsAuth = contentTypeisOpdsAuth;
const contentTypeisApiProblem = (contentType) => contentType === ContentType.ApiProblem;
exports.contentTypeisApiProblem = contentTypeisApiProblem;
//# sourceMappingURL=contentType.js.map