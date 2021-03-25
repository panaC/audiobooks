import TConfig from "../config/config";
import {
  initGlobalConverters_GENERIC,
  initGlobalConverters_OPDS,
} from '@r2-opds-js/opds/init-globals';

import {OpdsFeedViewConverter} from './converter/opds';
import {WebpubViewConverter} from './converter/webpub';
import {OpdsService} from './service/opds';
import { ConfigService } from './service/config';
import { LocaleService } from "./service/locale";

export const opdsFeedViewConverter = new OpdsFeedViewConverter();

export const webpubViewConverter = new WebpubViewConverter();

export const opdsService = new OpdsService();

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

type TConfigPartial = RecursivePartial<TConfig>;

const configUrl = process.env.CONFIG_URL || "";
console.log("CONFIG_URL:", configUrl);

export const configService = new ConfigService<TConfigPartial>(configUrl);

export const localeService = new LocaleService("fr", ["fr", "en"]);

initGlobalConverters_GENERIC();
initGlobalConverters_OPDS();

console.log("Dirname:", __dirname);
