import TConfig from '../config/config';
import {
  initGlobalConverters_GENERIC,
  initGlobalConverters_OPDS,
} from '@r2-opds-js/opds/init-globals';

import * as bodyParser from 'body-parser';
import * as express from 'express';
import {OpdsService} from './service/opds';
import {ConfigService} from './service/config';
import {LocaleService} from './service/locale';
import {LoggerService} from './service/logger';
import {StorageService} from './service/storage';
import {AppService, IAppSessionStorage, IAppUserStorage, IAppStore} from './service/app';
import {IPublicationHandler} from './type/publication.type';
import handler from './handler';
import { Store } from "./service/storage/store";

const opdsService = new OpdsService();

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

type TConfigPartial = RecursivePartial<TConfig>;

const configUrl =
  process.env.CONFIG_URL ||
  'https://rawcdn.githack.com/panaC/audiobooks/main/config/config.json';

const configService = new ConfigService<TConfigPartial>(configUrl);

const localeService = new LocaleService('fr', ['fr', 'en']);

const logService = new LoggerService();

interface IStore extends IAppStore {
  player: Record<
    string,
    | {
        i: number; // index
        t: number; // time
        d: number; // timestamp
      }
    | undefined
  >;
}
type TState =
  | 'publistover1'
  | 'alreadylisten'
  | 'nopub'
  | 'readytolisten'
  | 'notinrange';

interface ISessionStorage extends IAppSessionStorage {
  state: TState;
  query_publicationsList: Array<IPublicationHandler>; // publication_numberSlotFilling
  // query_publicationNumberSelected: boolean;
  listen_publication: IPublicationHandler; // listen_publication
  player_startIndex: number; // listen_ask
  player_startTime: number; // listen_ask
}

interface IUserStorage extends IAppUserStorage {}

const store = new Store<IStore>(configService);
const storageService = new StorageService<ISessionStorage, IUserStorage, IStore>(store);


// Create an app instance
const appService = new AppService(
  logService,
  storageService,
  localeService,
  opdsService,
  configService
);
export type TAppService = typeof appService;

// fulfillement
handler(appService);

initGlobalConverters_GENERIC();
initGlobalConverters_OPDS();

logService.log.info('Dirname: ' + __dirname);
logService.log.info('CONFIG_URL: ' + configUrl);

const expressApp = express().use(bodyParser.json());

expressApp.post('/', appService.app);

const port = process.env.PORT || 3000;
expressApp.listen(port);

logService.log.info('LISTEN ON PORT ' + port);
