import {OpdsFeedViewConverter} from './converter/opds';
import {WebpubViewConverter} from './converter/webpub';
import {OpdsService} from './service/opds';

export const opdsFeedViewConverter = new OpdsFeedViewConverter();

export const webpubViewConverter = new WebpubViewConverter();

export const opdsService = new OpdsService();

import {
  initGlobalConverters_GENERIC,
  initGlobalConverters_OPDS,
} from '@r2-opds-js/opds/init-globals';

initGlobalConverters_GENERIC();
initGlobalConverters_OPDS();
