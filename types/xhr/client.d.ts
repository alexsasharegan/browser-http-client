import * as headers from "./headers";
import * as url from "../encoding/url";
import { ContentType } from "./contentType";
export interface RequestOptions {
    query?: url.QueryObject;
    data?: RequestData;
    headers?: headers.HttpHeaders;
    responseType?: XMLHttpRequestResponseType;
    timeout?: number;
}
export declare type RequestData = {
    [key: string]: any;
} | FormData | Document;
export declare type RequestBody = string | FormData | Document;
export interface Response {
    data: any;
    status: number;
    statusText: string;
    headers: object;
    xhr: XMLHttpRequest;
}
export interface PromiseResolve<T> {
    (value?: any): any;
    (value?: T): T;
}
export interface PromiseReject {
    (reason?: any): any;
}
export declare class Client {
    private method;
    private url;
    static Timeout: number;
    static ResponseType: XMLHttpRequestResponseType;
    static Async: boolean;
    static DefaultHeaders: {
        Accept: ContentType;
        "X-Requested-With": string;
    };
    private xhr;
    private headers;
    private data;
    private query;
    private responseType;
    private timeout;
    private queryAdded;
    constructor(method: string, url: string);
    addHeaders(headers: headers.HttpHeaders): void;
    setHeaders(headers: headers.HttpHeaders): void;
    addQueryString(query: string): void;
    addQueryObject(query: url.QueryObject): void;
    private setData(data);
    private applyHeaders();
    private handleReadyStateChange(resolve, reject);
    private execute(resolve, reject);
    do(): Promise<Response>;
    static make(method: string, url: string, options?: RequestOptions): Client;
    static get(url: string, query?: url.QueryObject): Promise<Response>;
    static post(url: string, data: RequestData, options?: RequestOptions): Promise<Response>;
    static put(url: string, data: RequestData, options?: RequestOptions): Promise<Response>;
    static patch(url: string, data: RequestData, options?: RequestOptions): Promise<Response>;
    static delete(url: string, query?: url.QueryObject): Promise<Response>;
    static setResponseType(type: XMLHttpRequestResponseType): void;
}
