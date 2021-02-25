"use strict";
// ==LICENSE-BEGIN==
// Copyright 2017 European Digital Reading Lab. All rights reserved.
// Licensed to the Readium Foundation under one or more contributor license agreements.
// Use of this source code is governed by a BSD-style license
// that can be found in the LICENSE file exposed on Github (readium) in the project repository.
// ==LICENSE-END==
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterTypeLink = exports.filterRelLink = void 0;
function filterRelLink(ln, filter) {
    var _a;
    let relFlag = false;
    if (filter.rel) {
        if ((_a = ln.Rel) === null || _a === void 0 ? void 0 : _a.length) {
            ln.Rel.forEach((rel) => {
                if (Array.isArray(filter.rel) && filter.rel.includes(rel)) {
                    relFlag = true;
                }
                else if (filter.rel instanceof RegExp && filter.rel.test(rel)) {
                    relFlag = true;
                }
                else if ((rel === null || rel === void 0 ? void 0 : rel.replace(/\s/g, "")) === filter.rel) {
                    relFlag = true;
                }
            });
        }
    }
    return relFlag;
}
exports.filterRelLink = filterRelLink;
function filterTypeLink(ln, filter) {
    let typeFlag = false;
    if (ln.TypeLink) {
        if (Array.isArray(filter.type) && filter.type.includes(ln.TypeLink)) {
            typeFlag = true;
        }
        else if (filter.type instanceof RegExp && filter.type.test(ln.TypeLink)) {
            typeFlag = true;
        }
        else if (typeof filter.type === "string") {
            // compare typeSet and filterSet
            const filterSet = new Set(filter.type.split(";"));
            const typeArray = new Set(ln.TypeLink.replace(/\s/g, "").split(";"));
            typeFlag = true;
            for (const i of filterSet) {
                if (!typeArray.has(i)) {
                    typeFlag = false;
                    break;
                }
            }
        }
    }
    return typeFlag;
}
exports.filterTypeLink = filterTypeLink;
//# sourceMappingURL=filterLink.js.map