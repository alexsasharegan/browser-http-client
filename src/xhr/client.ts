import { Ok, Err, Result, expect_never } from "safe-types";
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

export enum RequestErrType {
  HttpStatusErr = "HttpStatusErr",
  XhrErr = "XhrErr",
  Timeout = "Timeout",
  Abort = "Abort",
}

export type Matchable<E> = { match: ClientErrMatcher<E> };

export type ClientErrorStatus<E> = {
  xhr: XMLHttpRequest;
  readonly type: RequestErrType.HttpStatusErr;
  response: Response<E>;
  event: Event;
};

export type ClientErrorAbort = {
  xhr: XMLHttpRequest;
  readonly type: RequestErrType.Abort;
  event: Event;
};

export type ClientErrorProgress = {
  xhr: XMLHttpRequest;
  readonly type: RequestErrType.Timeout;
  event: ProgressEvent;
};

export type ClientErrorError = {
  xhr: XMLHttpRequest;
  readonly type: RequestErrType.XhrErr;
  event: ErrorEvent;
};

export type ClientErrorBase<E> =
  | ClientErrorStatus<E>
  | ClientErrorAbort
  | ClientErrorProgress
  | ClientErrorError;

export type ClientError<E> =
  | Matchable<E> & ClientErrorStatus<E>
  | Matchable<E> & ClientErrorAbort
  | Matchable<E> & ClientErrorProgress
  | Matchable<E> & ClientErrorError;

export type ErrMatchObj<E, U> = {
  [RequestErrType.HttpStatusErr]: (err: ClientErrorStatus<E>) => U;
  [RequestErrType.XhrErr]: (err: ClientErrorError) => U;
  [RequestErrType.Timeout]: (err: ClientErrorProgress) => U;
  [RequestErrType.Abort]: (err: ClientErrorAbort) => U;
};

export interface ClientErrMatcher<E> {
  <U>(matcher: ErrMatchObj<E, U>): U;
}

function err_with_matcher<E>(err: ClientErrorBase<E>): ClientError<E> {
  return Object.assign(err, {
    match<U>(matcher: ErrMatchObj<E, U>): U {
      switch (err.type) {
        case RequestErrType.Abort:
          return matcher[RequestErrType.Abort](err);

        case RequestErrType.HttpStatusErr:
          return matcher[RequestErrType.HttpStatusErr](err);

        case RequestErrType.Timeout:
          return matcher[RequestErrType.Timeout](err);

        case RequestErrType.XhrErr:
          return matcher[RequestErrType.XhrErr](err);

        default:
          return expect_never(err, "invalid error type");
      }
    },
  });
}

/**
 * Parse an XHR into a Response object with a payload `T`.
 */
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

/**
 * Client is a class that wraps an individual XMLHttpRequest object.
 * A successful request takes the shape `T`, and an unsuccessful
 * request that returns a response (`HttpStatusErr`) takes the
 * shape `E`.
 */
export class Client<T, E> {
  /**
   * Timeout value in milliseconds.
   */
  public static Timeout: number = 0;
  /**
   * The XHR response parsing strategy.
   */
  public static ResponseType: XMLHttpRequestResponseType = "json";

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
  private responseType: XMLHttpRequestResponseType = Client.ResponseType;
  private timeout: number = Client.Timeout;
  private query_added: boolean = false;
  private req_sent: boolean = false;
  private has_aborted: boolean = false;
  private promise: Promise<Result<Response<T>, ClientError<E>>>;
  private xhr_evt_listeners: Array<{
    type: keyof XMLHttpRequestEventMap;
    listener: (
      this: XMLHttpRequest,
      ev: XMLHttpRequestEventMap[keyof XMLHttpRequestEventMap]
    ) => any;
    options?: boolean | AddEventListenerOptions;
  }> = [];
  private upload_evt_listeners: Array<{
    type: keyof XMLHttpRequestEventTargetEventMap;
    listener: (
      this: XMLHttpRequestUpload,
      ev: XMLHttpRequestEventTargetEventMap[keyof XMLHttpRequestEventTargetEventMap]
    ) => any;
    options?: boolean | AddEventListenerOptions;
  }> = [];

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

  /**
   * addQueryStr adds an already encoded query string to the url.
   *
   * _NOTE: prepends the query string with '?' char._
   */
  public addQueryStr(query: string): void {
    if (this.query_added) {
      throw new Error("Cannot add query string twice.");
    }
    this.url += "?";
    this.url += query;
    this.query_added = true;
  }

  /**
   * addQueryObj builds a query string from the object and adds it to the url.
   */
  public addQueryObj(query: QStr.QueryObject): void {
    this.addQueryStr(QStr.encode_query(query));
  }

  private setData(data: RequestData): void {
    if (data instanceof FormData || data instanceof Document) {
      this.data = data;
      return;
    }
    this.data = JSON.stringify(data);
    this.addHeaders({ "Content-Type": ContentType.Json + ";charset=utf-8" });
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

  /**
   * Returns a function that will cancel the underlying xhr.
   * If the xhr is underway, this will generate an error with type: `Abort`.
   */
  public getCancelToken(): () => void {
    return () => {
      this.has_aborted = true;
      this.xhr.abort();
    };
  }

  /**
   * Register event handlers on the xhr.
   * There's largely no reason to need this since
   * the xhr events are watched internally.
   */
  public addEventListener<K extends keyof XMLHttpRequestEventMap>(
    type: K,
    listener: (this: XMLHttpRequest, ev: XMLHttpRequestEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void {
    this.xhr_evt_listeners.push({
      type,
      listener,
      options,
    });
  }

  /**
   * Register event handlers on the xhr upload.
   * Useful for progress events on a file upload.
   */
  public addUploadEventListener<
    K extends keyof XMLHttpRequestEventTargetEventMap
  >(
    type: K,
    listener: (
      this: XMLHttpRequestUpload,
      ev: XMLHttpRequestEventTargetEventMap[K]
    ) => any,
    options?: boolean | AddEventListenerOptions
  ): void {
    this.upload_evt_listeners.push({
      type,
      listener,
      options,
    });
  }

  private handleReadyStateChange(
    resolve: PromiseResolver<Result<Response<T>, ClientError<E>>>,
    event: Event
  ) {
    if (this.xhr.readyState !== XMLHttpRequest.DONE || this.has_aborted) {
      return;
    }

    if (this.xhr.status < 200 || this.xhr.status >= 400) {
      resolve(
        Err(
          err_with_matcher({
            xhr: this.xhr,
            type: RequestErrType.HttpStatusErr,
            response: new_response<E>(this.xhr),
            event,
          })
        )
      );
    }

    resolve(Ok(new_response<T>(this.xhr)));
  }

  private execute(
    resolve: PromiseResolver<Result<Response<T>, ClientError<E>>>
  ): void {
    this.xhr.open(this.method, this.url, true);
    this.xhr.responseType = this.responseType;
    this.xhr.timeout = this.timeout;
    this.applyHeaders();
    this.xhr.onreadystatechange = this.handleReadyStateChange.bind(
      this,
      resolve
    );
    this.xhr.addEventListener("timeout", event =>
      resolve(
        Err(
          err_with_matcher({
            xhr: this.xhr,
            type: RequestErrType.Timeout,
            event,
          })
        )
      )
    );
    this.xhr.addEventListener("abort", event =>
      resolve(
        Err(
          err_with_matcher({
            xhr: this.xhr,
            type: RequestErrType.Abort,
            event,
          })
        )
      )
    );
    this.xhr.addEventListener("error", event =>
      resolve(
        Err(
          err_with_matcher({
            xhr: this.xhr,
            type: RequestErrType.XhrErr,
            event,
          })
        )
      )
    );
    for (let l of this.xhr_evt_listeners) {
      this.xhr.addEventListener(l.type, l.listener, l.options);
    }
    for (let l of this.upload_evt_listeners) {
      this.xhr.upload.addEventListener(l.type, l.listener, l.options);
    }
    this.xhr.send(this.data);
  }

  /**
   * send fires off the XHR and returns a promise with the Result.
   * Multiple calls will result in the same return value (wrapped in Promise).
   */
  public send(): Promise<Result<Response<T>, ClientError<E>>> {
    if (this.req_sent) {
      return this.promise;
    }
    this.promise = new Promise<Result<Response<T>, ClientError<E>>>(
      this.execute.bind(this)
    );
    this.req_sent = true;
    return this.promise;
  }

  /**
   * Construct a client manually for a request with a response shaped T,
   * or in the case of a bad request, shaped E.
   *
   * `Client.create` is useful when you need a cancellation token
   * or need to listen to special XHR events (like upload progress).
   */
  public static create<T = any, E = any>(
    method: string,
    url: string,
    options: RequestOptions = {}
  ): Client<T, E> {
    const client = new Client<T, E>(method, url);
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

  /**
   * Make a GET request with a response shaped T,
   * or in the case of a bad request, shaped E.
   */
  public static get<T = any, E = any>(
    url: string,
    query?: QStr.QueryObject
  ): Promise<Result<Response<T>, ClientError<E>>> {
    return Client.create<T, E>("GET", url, { query }).send();
  }

  /**
   * Make a POST request with a response shaped T,
   * or in the case of a bad request, shaped E.
   */
  public static post<T = any, E = any>(
    url: string,
    data: RequestData,
    options: RequestOptions = {}
  ): Promise<Result<Response<T>, ClientError<E>>> {
    options.data = data;
    return Client.create<T, E>("POST", url, options).send();
  }

  /**
   * Make a PUT request with a response shaped T,
   * or in the case of a bad request, shaped E.
   */
  public static put<T = any, E = any>(
    url: string,
    data: RequestData,
    options: RequestOptions = {}
  ): Promise<Result<Response<T>, ClientError<E>>> {
    options.data = data;
    return Client.create<T, E>("PUT", url, options).send();
  }

  /**
   * Make a PATCH request with a response shaped T,
   * or in the case of a bad request, shaped E.
   */
  public static patch<T = any, E = any>(
    url: string,
    data: RequestData,
    options: RequestOptions = {}
  ): Promise<Result<Response<T>, ClientError<E>>> {
    options.data = data;
    return Client.create<T, E>("PATCH", url, options).send();
  }

  /**
   * Make a DELETE request with a response shaped T,
   * or in the case of a bad request, shaped E.
   */
  public static delete<T = any, E = any>(
    url: string,
    query?: QStr.QueryObject
  ): Promise<Result<Response<T>, ClientError<E>>> {
    return Client.create<T, E>("DELETE", url, { query }).send();
  }

  /**
   * Sets the type of the response to enable correct parsing of the
   * XHR response.
   */
  public static setResponseType(type: XMLHttpRequestResponseType): void {
    Client.ResponseType = type;
  }
}
