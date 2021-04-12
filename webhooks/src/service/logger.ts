import {ConversationV3} from '@assistant/conversation';
import {Logger} from 'roarr/dist/src/types';
import log from 'roarr';

export class LoggerService {
  private _log: Logger;

  constructor() {
    this._log = log;
  }

  public setContext(conv: ConversationV3) {
    const context = {
      id: conv.session.id,
      user: {
        locale: conv.user.locale,
        lastSeenTime: conv.user.lastSeenTime,
        accountLinkingStatus: conv.user.accountLinkingStatus,
        status: conv.user.verificationStatus,
      },
      intent: Object.assign(conv.intent),
      scene: Object.assign(conv.scene),
    };

    this._log = log.child(context);
  }

  get log() {
    return this._log;
  }
}
