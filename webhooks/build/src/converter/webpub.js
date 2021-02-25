"use strict";
// ==LICENSE-BEGIN==
// Copyright 2017 European Digital Reading Lab. All rights reserved.
// Licensed to the Readium Foundation under one or more contributor license agreements.
// Use of this source code is governed by a BSD-style license
// that can be found in the LICENSE file exposed on Github (readium) in the project repository.
// ==LICENSE-END==
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebpubViewConverter = void 0;
const nanoid_1 = require("nanoid");
const moment = require("moment");
const localisation_1 = require("./tools/localisation");
const fallback_1 = require("./tools/fallback");
const di_1 = require("../di");
const localisation_2 = require("./tools/localisation");
class WebpubViewConverter {
    // Note: PublicationDocument and PublicationView are both Identifiable, with identical `identifier`
    convertWebpubToView(r2Publication, baseUrl) {
        var _a;
        const title = localisation_2.convertMultiLangStringToString(r2Publication.Metadata.Title);
        const publishers = localisation_1.convertContributorArrayToStringArray(r2Publication.Metadata.Publisher);
        const authors = localisation_1.convertContributorArrayToStringArray(r2Publication.Metadata.Author);
        let publishedAt;
        if (r2Publication.Metadata.PublicationDate) {
            publishedAt = moment(r2Publication.Metadata.PublicationDate).toISOString();
        }
        const coverLinks = fallback_1.fallback(di_1.opdsFeedViewConverter.convertFilterLinksToView(baseUrl, r2Publication.Resources, {
            type: ["image/png", "image/jpeg"],
            rel: "cover",
        }), di_1.opdsFeedViewConverter.convertFilterLinksToView(baseUrl, r2Publication.Resources, {
            type: ["image/png", "image/jpeg"],
        }), di_1.opdsFeedViewConverter.convertFilterLinksToView(baseUrl, r2Publication.Resources, {
            type: new RegExp("^image\/*"),
        }));
        const cover = (_a = coverLinks.find((v) => v.url)) === null || _a === void 0 ? void 0 : _a.url;
        const readingOrdersLinks = di_1.opdsFeedViewConverter.convertFilterLinksToView(baseUrl, r2Publication.Spine, {
            type: ["audio/mpeg"],
        });
        const readingOrders = readingOrdersLinks.map((l) => ({
            duration: l.duration,
            url: l.url,
        })) || [];
        return {
            identifier: nanoid_1.nanoid(),
            title,
            authors,
            description: r2Publication.Metadata.Description,
            languages: r2Publication.Metadata.Language,
            publishers,
            workIdentifier: r2Publication.Metadata.Identifier,
            publishedAt,
            cover,
            RDFType: r2Publication.Metadata.RDFType,
            duration: r2Publication.Metadata.Duration,
            nbOfTracks: readingOrders.length,
            readingOrders,
        };
    }
}
exports.WebpubViewConverter = WebpubViewConverter;
//# sourceMappingURL=webpub.js.map