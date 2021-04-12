import {conversation} from '@assistant/conversation';
import {
  Conversation,
  ConversationV3,
  ConversationV3App,
} from '@assistant/conversation/dist/conversation';
import {tryCatch} from '../utils/tryCatch';
import {ConfigService} from './config';
import {LocaleService} from './locale';
import {LoggerService} from './logger';
import {OpdsService} from './opds';
import {StorageService} from './storage';

export type IAppUserStorage = {};
export interface IAppSessionStorage {
  error: boolean;
}

export class AppService<
  TStorageService extends StorageService<IAppSessionStorage, IAppUserStorage>,
  TLocaleService extends LocaleService<any>,
  TConfigService extends ConfigService<any>
> {
  private _app: ReturnType<Conversation>;
  private _logService: LoggerService;
  private _storageService: TStorageService;
  private _localeService: TLocaleService;
  private _opdsService: OpdsService;
  private _configService: TConfigService;

  constructor(
    logService: LoggerService,
    storageService: TStorageService,
    localeService: TLocaleService,
    opdsService: OpdsService,
    configService: TConfigService
  ) {
    this._app = conversation();
    this._logService = logService;
    this._storageService = storageService;
    this._localeService = localeService;
    this._opdsService = opdsService;
    this._configService = configService;

    this._app.catch((conv, err) => {
      logService.log.error('app catch ' + err.message);

      conv.add("Une erreur s'est produite");
      conv.add(err.message);

      storageService.session.error = true;
      storageService.apply();

      /*
            conv.scene.next = {
              ...conv.scene.next,
              name: "home",
            };
            */
    });

    this._app.middleware((conv, _framework) => {
      this._storageService.setConv(conv);
      this._logService.setContext(conv);
      tryCatch(() => (localeService.locale = conv.user.locale.split('-')[0]));

      logService.log.info('new request from ' + conv.intent.name);

      // conv request
      // console.log("CONV DEBUG");
      // console.log(conv);
      // console.log("==========");

      // express
      // console.log(framework);
    });
  }

  get app() {
    return this._app;
  }

  get log() {
    return this._logService;
  }

  get locale() {
    return this._localeService;
  }

  get storage() {
    return this._storageService;
  }

  get config() {
    return this._configService;
  }

  get opds() {
    return this._opdsService;
  }

  public handle(
    ...arg: Parameters<ConversationV3App<ConversationV3>['handle']>
  ) {
    const [name, handler] = arg;
    this._app.handle(name, async conv => {
      try {
        // this._logService.log(`[${conv.intent.name}] start`);
        this._storageService.session.error = false;

        await Promise.resolve(handler(conv));
        //   } catch (e) {
        //     throw e;
        //   } finally {
      } finally {
        this._storageService.apply();
        // this._logService.log(`[${conv.intent.name}] done`);
        this._logService.log(
          'USER: ' +
            JSON.stringify(conv.user.params) +
            ' SESSION: ' +
            JSON.stringify(conv.session.params)
        );
      }
    });
  }
}
