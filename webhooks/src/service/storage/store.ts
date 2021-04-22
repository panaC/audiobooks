import { IStoreNew } from "../storage";
import {ok} from 'assert';
import { httpFetchFormattedResponse } from "../../utils/http";
import { ConfigService } from "../config";

// get set and get url from config repo
//
//

export type TConfigService = ConfigService<{ store?: { set?: string; get?: string; } }>;

export class Store<
  T extends object,
  > implements IStoreNew<T> {

  private _key: string | undefined;
  private _config: TConfigService;
  private _store: Partial<T>;

  constructor(config: TConfigService) {
    this._config = config;
    this._store = {};
  }

  public async init(key: string) {

    this._key = key;
    await this.get();

    return undefined;
  }

  public async get() {
    ok(this._key, "user key not defined");

    const config = await this._config.get();

    const GET_URL = config.store?.get;
    ok(GET_URL, "GET URL not found");

    const body = {
      kind: "User",
      key: this._key,
    };

    const res = await httpFetchFormattedResponse<T | undefined>(GET_URL, {
      method: 'post',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' }
    });

    if (res.isSuccess) {
      const dataReceived = await res.response?.json();
      this._store = dataReceived || {};
    } else {
      this._store = {};
    }

    return this._store;
  }

  get store() {
    return this._store;
  }

  public async apply(b: Partial<T>) {

    const config = await this._config.get();

    const SET_URL = config.store?.set;
    ok(SET_URL, "SET URL not found");

    const body = {
      kind: "User",
      key: this._key,
      value: b,
    };

    const res = await httpFetchFormattedResponse<T | undefined>(SET_URL, {
      method: 'post',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' }
    });

    ok(res.isSuccess, 'http get store request error ' + res.statusMessage);
    ok(res.statusCode === 200, 'store savec error ' + await res.response?.text());

    this._store = b;

    return Promise.resolve();
   }
}
