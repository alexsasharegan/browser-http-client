import { QueryObject } from "../uri/encode";
import { Response } from "./response";
export interface RequestOptions {
    query?: QueryObject;
    data?: RequestData;
    headers?: {
        [key: string]: string;
    };
    responseType?: XMLHttpRequestResponseType;
    timeout?: number;
}
export declare type RequestData = {
    [key: string]: any;
} | FormData | Document;
export declare type RequestBody = string | FormData | Document;
export declare type HeaderObject = {
    [key: string]: string;
};
export interface PromiseResolve<T> {
    (value?: any): any;
    (value?: T): T;
}
export interface PromiseReject {
    (reason?: any): any;
}
export declare class Client {
    static Timeout: number;
    static ResponseType: XMLHttpRequestResponseType;
    static DefaultHeaders: {
        Accept: string;
        "Cache-Control": string;
        "X-Requested-With": string;
    };
    private xhr;
    private method;
    private url;
    private headers;
    private data;
    private query;
    private responseType;
    private timeout;
    private queryAdded;
    constructor(method: string, url: string);
    setHeaders(headers: HeaderObject): void;
    addQueryString(query: string): void;
    addQueryObject(query: QueryObject): void;
    private setData(data);
    private applyHeaders();
    private handleReadyStateChange(resolve, reject);
    private execute(resolve, reject);
    do(): Promise<Response>;
    static make(method: string, url: string, options?: RequestOptions): Client;
    static get(url: string, query?: QueryObject): Promise<Response>;
    static post(url: string, data: RequestData, options?: RequestOptions): Promise<Response>;
    static put(url: string, data: RequestData, options?: RequestOptions): Promise<Response>;
    static patch(url: string, data: RequestData, options?: RequestOptions): Promise<Response>;
    static delete(url: string, query?: QueryObject): Promise<Response>;
    static setResponseType(type: XMLHttpRequestResponseType): void;
    static readonly Async: boolean;
}
