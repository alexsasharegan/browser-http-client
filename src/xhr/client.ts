import { Ok, Err, Option, Result, Some, None } from "safe-types";
import * as Headers from "./headers";
import * as QStr from "../encoding/qstr";
import { ContentType } from "./contentType";

export interface RequestOptions {
  query?: QStr.QueryObject;
  data?: RequestData;
  headers?: Headers.HttpHeaders;
  responseType?: XMLHttpRequestResponseType;
  timeout?: number;
}

export type RequestData = { [key: string]: any } | FormData | Document;
export type RequestBody = string | FormData | Document;

export interface Response<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: { [field: string]: string | string[] };
  xhr: XMLHttpRequest;
}

export type ClientErrorBasic<T> = {
  readonly type: ResErrCode.Abort | ResErrCode.HttpStatusErr;
  response: Option<Response<T>>;
  event: Event;
};

export type ClientErrorProgress<T> = {
  readonly type: ResErrCode.Timeout;
  response: Option<Response<T>>;
  event: ProgressEvent;
};

export type ClientErrorError<T> = {
  readonly type: ResErrCode.XhrErr;
  response: Option<Response<T>>;
  event: ErrorEvent;
};

export type ClientError<T> =
  | ClientErrorBasic<T>
  | ClientErrorProgress<T>
  | ClientErrorError<T>;

export enum ResErrCode {
  HttpStatusErr = 1,
  XhrErr,
  Timeout,
  Abort,
}

function new_response<T>(xhr: XMLHttpRequest): Response<T> {
  let r: Response<T> = Object.create(null);

  r.xhr = xhr;
  r.data = xhr.response;
  r.status = xhr.status;
  r.statusText = xhr.statusText;
  r.headers = Headers.parse(xhr.getAllResponseHeaders(), Object.create(null));

  return r;
}

export interface PromiseResolver<T> {
  (value: T): T;
}

export class Client {
  public static Timeout: number = 0;
  public static ResponseType: XMLHttpRequestResponseType = "json";
  public static Async: boolean = true;

  public static DefaultHeaders = {
    Accept: ContentType.Json,
    "X-Requested-With": "XMLHttpRequest",
  };

  private xhr: XMLHttpRequest = new XMLHttpRequest();
  private headers: Headers.HttpHeaders = Object.assign(
    Object.create(null),
    Client.DefaultHeaders
  );
  private data: RequestBody;
  private query: string;
  private responseType: XMLHttpRequestResponseType = Client.ResponseType;
  private timeout: number = Client.Timeout;
  private queryAdded: boolean = false;

  constructor(private method: string, private url: string) {}

  /**
   * Adds an object of headers via `Object.assign`
   * that will be written to the XHR.
   */
  public addHeaders(headers: Headers.HttpHeaders): void {
    Object.assign(this.headers, headers);
  }
  /**
   * Sets a new object of headers that will be written to the XHR.
   */
  public setHeaders(headers: Headers.HttpHeaders): void {
    this.headers = Object.assign(Object.create(null), headers);
  }

  public addQueryStr(query: string): void {
    if (this.queryAdded) {
      throw new Error("Cannot add query string twice.");
    }
    this.url += "?";
    this.url += query;
    this.queryAdded = true;
  }

  public addQueryObj(query: QStr.QueryObject): void {
    this.addQueryStr(QStr.encode_query(query));
  }

  private setData(data: RequestData): void {
    if (data instanceof FormData || data instanceof Document) {
      this.data = data;
      return;
    }
    this.data = JSON.stringify(data);
    this.addHeaders({ "Content-Type": ContentType.Json });
  }

  private applyHeaders(): void {
    let header: string;
    for (header in this.headers) {
      if (!this.headers[header]) {
        continue;
      }
      this.xhr.setRequestHeader(header, this.headers[header]);
    }
  }

  private handleReadyStateChange<T>(
    resolve: PromiseResolver<Result<Response<T>, ClientError<T>>>,
    event: Event
  ) {
    if (this.xhr.readyState !== XMLHttpRequest.DONE) {
      return;
    }

    let r = new_response<T>(this.xhr);
    if (this.xhr.status < 200 || this.xhr.status >= 400) {
      resolve(
        Err(<ClientErrorBasic<T>>{
          type: ResErrCode.HttpStatusErr,
          response: Some(r),
          event,
        })
      );
    }

    resolve(Ok(r));
  }

  private execute<T>(
    resolve: PromiseResolver<Result<Response<T>, ClientError<T>>>
  ) {
    this.xhr.open(this.method, this.url, Client.Async);
    this.xhr.responseType = this.responseType;
    this.xhr.timeout = this.timeout;
    this.applyHeaders();
    this.xhr.onreadystatechange = this.handleReadyStateChange.bind(
      this,
      resolve
    );
    this.xhr.ontimeout = event =>
      resolve(
        Err(<ClientErrorProgress<T>>{
          type: ResErrCode.Timeout,
          response: None(),
          event,
        })
      );
    this.xhr.onabort = event =>
      resolve(
        Err(<ClientErrorBasic<T>>{
          type: ResErrCode.Abort,
          response: None(),
          event,
        })
      );
    this.xhr.onerror = event =>
      resolve(
        Err(<ClientErrorError<T>>{
          type: ResErrCode.XhrErr,
          response: None(),
          event,
        })
      );
    this.xhr.upload;
    this.xhr.send(this.data);
  }

  public do<T = any>(): Promise<Result<Response<T>, ClientError<T>>> {
    return new Promise<Result<Response<T>, ClientError<T>>>(
      this.execute.bind(this)
    );
  }

  public static make(
    method: string,
    url: string,
    options: RequestOptions = {}
  ): Client {
    const client = new Client(method, url);
    if (options.query) {
      client.addQueryObj(options.query);
    }
    if (options.data) {
      client.setData(options.data);
    }
    if (options.responseType) {
      client.responseType = options.responseType;
    }
    if (options.headers) {
      client.setHeaders(options.headers);
    }
    if (options.timeout) {
      client.timeout = options.timeout;
    }
    return client;
  }

  public static get<T = any>(
    url: string,
    query?: QStr.QueryObject
  ): Promise<Result<Response<T>, ClientError<T>>> {
    return Client.make("GET", url, { query }).do();
  }

  public static post<T = any>(
    url: string,
    data: RequestData,
    options: RequestOptions = {}
  ): Promise<Result<Response<T>, ClientError<T>>> {
    options.data = data;
    return Client.make("POST", url, options).do();
  }

  public static put<T = any>(
    url: string,
    data: RequestData,
    options: RequestOptions = {}
  ): Promise<Result<Response<T>, ClientError<T>>> {
    options.data = data;
    return Client.make("PUT", url, options).do();
  }

  public static patch<T = any>(
    url: string,
    data: RequestData,
    options: RequestOptions = {}
  ): Promise<Result<Response<T>, ClientError<T>>> {
    options.data = data;
    return Client.make("PATCH", url, options).do();
  }

  public static delete<T = any>(
    url: string,
    query?: QStr.QueryObject
  ): Promise<Result<Response<T>, ClientError<T>>> {
    return Client.make("DELETE", url, { query }).do();
  }

  public static setResponseType(type: XMLHttpRequestResponseType): void {
    Client.ResponseType = type;
  }
}
