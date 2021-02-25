"use strict";
// ==LICENSE-BEGIN==
// Copyright 2017 European Digital Reading Lab. All rights reserved.
// Licensed to the Readium Foundation under one or more contributor license agreements.
// Use of this source code is governed by a BSD-style license
// that can be found in the LICENSE file exposed on Github (readium) in the project repository.
// ==LICENSE-END==
Object.defineProperty(exports, "__esModule", { value: true });
exports.urlPathResolve = void 0;
const node_url_1 = require("node:url");
const urlPathResolve = (from, to) => (to
    && !/^https?:\/\//.exec(to)
    && !/^data:\/\//.exec(to))
    ? new node_url_1.URL(to, from).toString()
    : to;
exports.urlPathResolve = urlPathResolve;
//# sourceMappingURL=resolveUrl.js.map