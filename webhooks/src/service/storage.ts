import {ConversationV3} from '@assistant/conversation';
import {createDraft, Draft, finishDraft, isDraft} from 'immer';
import {ok} from 'assert';

const _isDraft = <T>(v: T | undefined): v is T => {
  return isDraft(v);
};

export interface IStoreNew<T> {
  apply: (d: Partial<T>) => Promise<void>;
  store: Partial<T>;
  init: (key: string) => Promise<undefined>;
}

export interface IUserStorageService {
  bearerToken?: string;
}

export class StorageService<
  TSession extends object,
  TUser extends IUserStorageService,
  TStore extends object
> {
  private _conv: ConversationV3 | undefined;
  private _session: Draft<Partial<TSession>> | undefined;
  private _user: Draft<Partial<TUser>> | undefined;
  private _store: Draft<Partial<TStore>> | undefined;
  private _storeAdapter: IStoreNew<TStore>;

  constructor(store: IStoreNew<TStore>) {
    this._storeAdapter = store;
  }

  public async init(conv: ConversationV3) {
    this._conv = conv;
  }

  get storeAdapter() {
    return this._storeAdapter;
  }

  get session(): Draft<Partial<TSession>> {
    ok(this._conv, 'conv value not set');
    this._session = _isDraft(this._session)
      ? this._session
      : createDraft((this._conv.session.params || {}) as Partial<TSession>);

    return this._session;
  }

  get user() {
    ok(this._conv, 'conv value not set');
    this._user = _isDraft(this._user)
      ? this._user
      : createDraft((this._conv.user.params || {}) as Partial<TUser>);
    return this._user;
  }

  public async storeGet() {
    // @ts-ignore
    // bug with Draft :(
    const key = this.user?.bearerToken;
    await this._storeAdapter.init(key);
    return this.store;
  }

  get store() {
    this._store = _isDraft(this._store)
      ? this._store
      : createDraft((this._storeAdapter.store || {}) as Partial<TStore>);
    return this._store;
  }

  public async apply() {
    let p = Promise.resolve();

    if (isDraft(this._store)) {
      const b = finishDraft(this._store);
      p = this._storeAdapter.apply(b as TStore) || p;
      this._store = undefined;
    }
    if (!this._conv) return;
    if (isDraft(this._user)) {
      this._conv.user.params = finishDraft(this._user) as TUser;
      this._user = undefined;
    }
    if (isDraft(this._session)) {
      const b = finishDraft(this._session);
      this._conv.session.params = b as TSession;
      this._session = undefined;
    }

    await p;
  }
}
