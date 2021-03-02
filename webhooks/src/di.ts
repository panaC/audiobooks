import {I18n} from 'i18n';
import * as path from 'path';

import {
  initGlobalConverters_GENERIC,
  initGlobalConverters_OPDS,
} from '@r2-opds-js/opds/init-globals';

import {OpdsFeedViewConverter} from './converter/opds';
import {WebpubViewConverter} from './converter/webpub';
import {OpdsService} from './service/opds';

export const opdsFeedViewConverter = new OpdsFeedViewConverter();

export const webpubViewConverter = new WebpubViewConverter();

export const opdsService = new OpdsService();

initGlobalConverters_GENERIC();
initGlobalConverters_OPDS();

console.log(__dirname);

export const i18n = new I18n();
i18n.configure({
  locales: ['fr-FR', 'en'],
  defaultLocale: 'fr-FR',
  directory: path.join(__dirname, '../locales'),
});
