/// <reference types="node" />
import { URL } from "node:url";
import { IHttpGetResult, THttpGetCallback, THttpOptions, THttpResponse } from "./type/http";
export declare function httpFetchRawResponse(url: string | URL, options?: THttpOptions, locale?: string): Promise<THttpResponse>;
export declare function httpFetchFormattedResponse<TData = undefined>(url: string | URL, options?: THttpOptions, callback?: THttpGetCallback<TData>, locale?: string): Promise<IHttpGetResult<TData>>;
