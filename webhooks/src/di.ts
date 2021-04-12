import TConfig from '../config/config';
import {
  initGlobalConverters_GENERIC,
  initGlobalConverters_OPDS,
} from '@r2-opds-js/opds/init-globals';

import {OpdsFeedViewConverter} from './converter/opds';
import {WebpubViewConverter} from './converter/webpub';
import {OpdsService} from './service/opds';
import {ConfigService} from './service/config';
import {LocaleService} from './service/locale';
import {LoggerService} from './service/logger';

export const opdsFeedViewConverter = new OpdsFeedViewConverter();

export const webpubViewConverter = new WebpubViewConverter();

export const opdsService = new OpdsService();

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

type TConfigPartial = RecursivePartial<TConfig>;

const configUrl =
  process.env.CONFIG_URL ||
  'https://rawcdn.githack.com/panaC/audiobooks/main/config/config.json';

export const configService = new ConfigService<TConfigPartial>(configUrl);

export const localeService = new LocaleService('fr', ['fr', 'en']);

export const logService = new LoggerService();

initGlobalConverters_GENERIC();
initGlobalConverters_OPDS();

logService.log.info('Dirname: ' + __dirname);
logService.log.info('CONFIG_URL: ' + configUrl);
