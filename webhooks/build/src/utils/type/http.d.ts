/// <reference types="node" />
import { RequestInit, Response } from "node-fetch";
import { URL } from "node:url";
export declare type THttpOptions = RequestInit;
export declare type THttpResponse = Response;
export interface IHttpGetResult<TData> {
    readonly url: string | URL;
    readonly isFailure: boolean;
    readonly isSuccess: boolean;
    readonly isNetworkError?: boolean;
    readonly isTimeout?: boolean;
    readonly isAbort?: boolean;
    readonly timeoutConnect?: boolean;
    readonly responseUrl?: string;
    readonly statusCode?: number;
    readonly statusMessage?: string;
    contentType?: string;
    body?: NodeJS.ReadableStream;
    response?: THttpResponse;
    data?: TData;
}
export declare type THttpGetResultAfterCallback<TData> = Omit<IHttpGetResult<TData>, "body" | "response">;
export declare type THttpGetCallback<T> = (result: IHttpGetResult<T>) => THttpGetResultAfterCallback<T> | Promise<THttpGetResultAfterCallback<T>>;
