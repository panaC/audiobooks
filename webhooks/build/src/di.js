"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.opdsService = exports.webpubViewConverter = exports.opdsFeedViewConverter = void 0;
const opds_1 = require("./converter/opds");
const webpub_1 = require("./converter/webpub");
const opds_2 = require("./service/opds");
exports.opdsFeedViewConverter = new opds_1.OpdsFeedViewConverter();
exports.webpubViewConverter = new webpub_1.WebpubViewConverter();
exports.opdsService = new opds_2.OpdsService();
//# sourceMappingURL=di.js.map