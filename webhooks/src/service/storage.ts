import {ConversationV3} from '@assistant/conversation';
import {createDraft, Draft, finishDraft, isDraft} from 'immer';
import {ok} from 'assert';

const _isDraft = <T>(v: T | undefined): v is T => {
  return isDraft(v);
};

export class StorageService<TSession extends object, TUser extends object> {
  private _conv: ConversationV3 | undefined;
  private _session: Draft<Partial<TSession>> | undefined;
  private _user: Draft<Partial<TUser>> | undefined;

  constructor() {}

  public setConv(conv: ConversationV3) {
    this._conv = conv;
    this._user = createDraft((conv.user.params || {}) as Partial<TUser>);
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

  public apply() {
    if (!this._conv) return;
    if (isDraft(this._user)) {
      this._conv.user.params = finishDraft(this._user) as TUser;
    }
    if (isDraft(this._session)) {
      const b = finishDraft(this._session);
      this._conv.session.params = b as TSession;
    }
  }
}
