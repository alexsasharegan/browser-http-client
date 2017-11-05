import { encodeQueryObj, QueryObject } from "../uri/encode"
import { parseHeaders } from "./headers"
import { Response } from "./response"

export interface RequestOptions {
  query?: QueryObject
  data?: RequestData
  headers?: { [key: string]: string }
  responseType?: XMLHttpRequestResponseType
  timeout?: number
}

export type RequestData = { [key: string]: any } | FormData | Document
export type RequestBody = string | FormData | Document
export type HeaderObject = { [key: string]: string }

export interface PromiseResolve<T> {
  (value?: any): any
  (value?: T): T
}

export interface PromiseReject {
  (reason?: any): any
}

export class Client {
  public static Timeout: number = 0
  public static ResponseType: XMLHttpRequestResponseType = "json"

  public static DefaultHeaders = {
    Accept: "application/json",
    "Cache-Control": "no-cache",
    "X-Requested-With": "XMLHttpRequest"
  }

  private xhr: XMLHttpRequest
  private method: string
  private url: string
  private headers: HeaderObject
  private data: RequestBody = null
  private query: string
  private responseType: XMLHttpRequestResponseType = Client.ResponseType
  private timeout: number = Client.Timeout

  private queryAdded: boolean = false

  constructor(method: string, url: string) {
    Object.assign(this, {
      method,
      url,
      headers: Object.assign({}, Client.DefaultHeaders),
      xhr: new XMLHttpRequest()
    })
  }

  /**
   * Sets an object of headers that will be written to the XHR.
   * { [header: string]: value: string }
   */
  setHeaders(headers: HeaderObject): void {
    Object.assign(this.headers, headers)
  }
  addQueryString(query: string): void {
    if (this.queryAdded) {
      throw new Error("Cannot add query string twice.")
    }
    this.url += "?"
    this.url += query
    this.queryAdded = true
  }
  addQueryObject(query: QueryObject): void {
    this.addQueryString(encodeQueryObj(query))
  }

  private setData(data: RequestData): void {
    if (!data) {
      return
    }
    if (data instanceof FormData || data instanceof Document) {
      this.data = data
    }
    this.data = JSON.stringify(data)
  }
  private applyHeaders(): void {
    for (const header of Object.keys(this.headers)) {
      if (!this.headers[header]) {
        continue
      }
      this.xhr.setRequestHeader(header, this.headers[header])
    }
  }
  private handleReadyStateChange(resolve: PromiseResolve<Response>, reject: PromiseReject) {
    if (this.xhr.readyState !== XMLHttpRequest.DONE) {
      return
    }

    const response = new Response()
    response.data = this.xhr.responseType == "text" ? this.xhr.responseText : this.xhr.response
    response.status = this.xhr.status
    response.statusText = this.xhr.statusText
    response.headers = parseHeaders(this.xhr.getAllResponseHeaders())
    response.xhr = this.xhr

    if (this.xhr.status < 200 || this.xhr.status >= 400) {
      reject(response)
    }

    resolve(response)
  }
  private execute(resolve: PromiseResolve<Response>, reject: PromiseReject) {
    this.xhr.open(this.method, this.url, Client.Async)
    this.xhr.responseType = this.responseType
    this.xhr.timeout = this.timeout
    this.applyHeaders()
    this.xhr.onreadystatechange = this.handleReadyStateChange.bind(this, resolve, reject)
    this.xhr.ontimeout = reject
    this.xhr.onerror = reject
    this.xhr.send(this.data)
  }

  do(): Promise<Response> {
    return new Promise<Response>(this.execute.bind(this))
  }

  static make(method: string, url: string, options: RequestOptions = {}): Client {
    const client = new Client(method, url)
    if (options.query) {
      client.addQueryObject(options.query)
    }
    if (method != "GET" && options.data) {
      client.setData(options.data)
    }
    if (options.responseType) {
      client.responseType = options.responseType
    }
    if (options.headers) {
      client.setHeaders(options.headers)
    }
    if (options.timeout) {
      client.timeout = options.timeout
    }
    return client
  }

  public static get(url: string, query?: QueryObject): Promise<Response> {
    return Client.make("GET", url, { query }).do()
  }
  public static post(url: string, data: RequestData, options: RequestOptions = {}): Promise<Response> {
    options.data = data
    return Client.make("POST", url, options).do()
  }
  public static put(url: string, data: RequestData, options: RequestOptions = {}): Promise<Response> {
    options.data = data
    return Client.make("PUT", url, options).do()
  }
  public static patch(url: string, data: RequestData, options: RequestOptions = {}): Promise<Response> {
    options.data = data
    return Client.make("PATCH", url, options).do()
  }
  public static delete(url: string, query?: QueryObject): Promise<Response> {
    return Client.make("DELETE", url, { query }).do()
  }

  public static setResponseType(type: XMLHttpRequestResponseType): void {
    Client.ResponseType = type
  }

  static get Async() {
    return true
  }
}
