import { QueryObject } from "../uri/encode";
import { Response } from "./response";
export interface RequestOptions {
    query?: QueryObject;
    params?: {
        [key: string]: any;
    };
    headers?: {
        [key: string]: string;
    };
}
export declare type RequestBody = {
    [key: string]: any;
} | FormData;
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
    static DefaultHeaders: {
        Accept: string;
        "Cache-Control": string;
        "X-Requested-With": string;
    };
    private xhr;
    private method;
    private url;
    private headers;
    private body;
    private query;
    private queryAdded;
    constructor(method: string, url: string, contentType?: string);
    setHeaders(headers: HeaderObject): this;
    addQueryString(query: string): this;
    addQueryObject(query: QueryObject): this;
    private applyHeaders();
    private handleReadyStateChange(resolve);
    private execute(resolve, reject);
    do(): Promise<Response>;
    static make(method: string, url: string, options?: RequestOptions): Client;
    static get(url: string, query?: QueryObject): Promise<Response>;
    static post(url: string, options?: RequestOptions): Promise<Response>;
    static put(url: string, options?: RequestOptions): Promise<Response>;
    static patch(url: string, options?: RequestOptions): Promise<Response>;
    static delete(url: string, query?: QueryObject): Promise<Response>;
    static readonly Async: boolean;
}
