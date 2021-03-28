import {ok} from 'assert';
import {URL} from 'url';
import {httpFetchFormattedResponse} from '../utils/http';

export class ConfigService<T> {
  private data: T | undefined;
  private url: string;

  constructor(url: string) {
    this.url = url;

    ok(new URL(this.url), 'bad config url');
  }

  public async get(): Promise<T> {
    if (this.data === undefined) {
      await this.getData();
    }

    if (!this.data) {
      throw new Error('data is empty');
    }

    return this.data;
  }

  private async getData(): Promise<T | undefined> {
    const res = await httpFetchFormattedResponse<T | undefined>(this.url);

    ok(res.isSuccess, 'http get config request error ' + res.statusMessage);

    const dataReceived = await res.response?.json();
    if (!dataReceived) {
      return undefined;
    }

    this.data = dataReceived;
    return dataReceived;
  }
}
