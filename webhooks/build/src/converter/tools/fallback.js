"use strict";
// ==LICENSE-BEGIN==
// Copyright 2017 European Digital Reading Lab. All rights reserved.
// Licensed to the Readium Foundation under one or more contributor license agreements.
// Use of this source code is governed by a BSD-style license
// that can be found in the LICENSE file exposed on Github (readium) in the project repository.
// ==LICENSE-END==
Object.defineProperty(exports, "__esModule", { value: true });
exports.fallback = void 0;
const fallback = (...valueArray) => valueArray.reduce((pv, cv) => (Array.isArray(cv) && cv.length)
    ? cv
    : pv, []);
exports.fallback = fallback;
//# sourceMappingURL=fallback.js.map