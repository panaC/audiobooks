import fetch, {Headers} from 'node-fetch';
import {
  IHttpGetResult,
  THttpGetCallback,
  THttpOptions,
  THttpResponse,
} from './type/http';
import * as https from 'https';
import {URL} from 'url';

const DEFAULT_HTTP_TIMEOUT = 30000;
const debug = console.log;

export async function httpFetchRawResponse(
  url: string | URL,
  options: THttpOptions = {},
  locale = 'fr-FR'
): Promise<THttpResponse> {
  options.headers =
    options.headers instanceof Headers
      ? options.headers
      : new Headers(options.headers || {});
  options.headers.set('user-agent', 'fetch');
  options.headers.set('accept-language', `${locale},en-US;q=0.7,en;q=0.5`);

  // https://github.com/node-fetch/node-fetch#custom-agent
  // httpAgent doesn't works // err: Protocol "http:" not supported. Expected "https:
  // this a nodeJs issues !
  //
  // const httpAgent = new http.Agent({
  //     timeout: options.timeout || DEFAULT_HTTP_TIMEOUT,
  // });
  // options.agent = (parsedURL: URL) => {
  //     if (parsedURL.protocol === "http:") {
  //           return httpAgent;
  //     } else {
  //           return httpsAgent;
  //     }
  // };
  if (!options.agent && url.toString().startsWith('https:')) {
    const httpsAgent = new https.Agent({
      timeout: options.timeout || DEFAULT_HTTP_TIMEOUT,
      rejectUnauthorized: true,
    });
    options.agent = httpsAgent;
  }
  options.timeout = options.timeout || DEFAULT_HTTP_TIMEOUT;

  const response = await fetch(url, options);

  debug('fetch URL:', `${url}`);
  debug('Method', options.method);
  // debug('Request headers :');
  // debug(options.headers);
  // debug('###');
  debug('OK: ', response.ok);
  debug('status code :', response.status);
  debug('status text :', response.statusText);

  return response;
}

const handleCallback = async <T = undefined>(
  res: IHttpGetResult<T>,
  callback: THttpGetCallback<T>
) => {
  if (callback) {
    res = await Promise.resolve(callback(res));

    // remove for IPC sync
    res.body = undefined;
    res.response = undefined;
  }
  return res;
};

export async function httpFetchFormattedResponse<TData = undefined>(
  url: string | URL,
  options?: THttpOptions,
  callback?: THttpGetCallback<TData>,
  locale?: string
): Promise<IHttpGetResult<TData>> {
  let result: IHttpGetResult<TData> = {
    isFailure: true,
    isSuccess: false,
    url,
  };

  try {
    const response = await httpFetchRawResponse(url, options, locale);

    // debug('Response headers :');
    // debug({...response.headers.raw()});
    // debug('###');

    result = {
      isAbort: false,
      isNetworkError: false,
      isTimeout: false,
      isFailure: !response.ok /*response.status < 200 || response.status >= 300*/,
      isSuccess:
        response.ok /*response.status >= 200 && response.status < 300*/,
      url,
      responseUrl: response.url,
      statusCode: response.status,
      statusMessage: response.statusText,
      body: response.body,
      response,
      data: undefined,
      contentType: response.headers.get('Content-Type') || '',
      // cookies: response.headers.get("Set-Cookie"),
    };
  } catch (err) {
    const errStr = err.toString();

    debug(errStr);

    if (err.name === 'AbortError') {
      result = {
        isAbort: true,
        isNetworkError: false,
        isTimeout: false,
        isFailure: true,
        isSuccess: false,
        url,
      };
    } else if (errStr.includes('timeout')) {
      // err.name === "FetchError"
      result = {
        isAbort: false,
        isNetworkError: true,
        isTimeout: true,
        isFailure: true,
        isSuccess: false,
        url,
        statusMessage: errStr,
      };
    } else {
      // err.name === "FetchError"
      result = {
        isAbort: false,
        isNetworkError: true,
        isTimeout: false,
        isFailure: true,
        isSuccess: false,
        url,
        statusMessage: errStr,
      };
    }
  } finally {
    if (callback) {
      result = await handleCallback(result, callback);
    }
  }

  return result;
}
