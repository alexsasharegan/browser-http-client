import { encodeQueryObj, QueryObject } from "../uri/encode"
import { parseHeaders } from "./headers"
import { Response } from "./response"

export interface RequestOptions {
  query?: QueryObject
  params?: { [key: string]: any }
  headers?: { [key: string]: string }
}

type RequestBody = { [key: string]: any } | FormData
type HeaderObject = { [key: string]: string }

interface PromiseResolve<T> {
  (value?: any): any
  (value?: T): T
}

interface PromiseReject {
  (reason?: any): any
}

export class Client {
  public static Timeout: number = 0

  public static DefaultHeaders = {
    Accept: "application/json",
    "Cache-Control": "no-cache",
    "X-Requested-With": "XMLHttpRequest"
  }

  private xhr: XMLHttpRequest
  private method: string
  private url: string
  private headers: HeaderObject
  private body: RequestBody
  private query: string

  private queryAdded: boolean = false

  constructor(method: string, url: string, contentType = "application/json") {
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
  setHeaders(headers: HeaderObject): this {
    Object.assign(this.headers, headers)
    return this
  }
  addQueryString(query: string): this {
    if (this.queryAdded) {
      throw new Error("Cannot add query string twice.")
    }
    this.url += "?"
    this.url += query
    this.queryAdded = true
    return this
  }
  addQueryObject(query: QueryObject): this {
    return this.addQueryString(encodeQueryObj(query))
  }

  private applyHeaders(): this {
    for (const header of Object.keys(this.headers)) {
      this.xhr.setRequestHeader(header, this.headers[header])
    }
    return this
  }
  private handleReadyStateChange(resolve: PromiseResolve<Response>) {
    if (this.xhr.readyState !== XMLHttpRequest.DONE) {
      return
    }
    const response = Object.assign(new Response(), {
      responseHeaders: "getAllResponseHeaders" in this.xhr ? parseHeaders(this.xhr.getAllResponseHeaders()) : {},
      responseData: this.xhr.responseType == "text" ? this.xhr.responseText : this.xhr.response,
      xhr: this.xhr
    })
    resolve(response)
  }
  private execute(resolve: PromiseResolve<Response>, reject: PromiseReject) {
    this.xhr.open(this.method, this.url, Client.Async)
    this.applyHeaders()
    this.xhr.onreadystatechange = this.handleReadyStateChange.bind(this, resolve)
    this.xhr.ontimeout = reject
    this.xhr.onerror = reject
  }

  do(): Promise<Response> {
    return new Promise<Response>(this.execute.bind(this))
  }

  static make(method: string, url: string, options: RequestOptions = {}): Client {
    const client = new Client(method, url)

    if (options.query) {
      client.addQueryObject(options.query)
    }
    if (options.params) {
      //
    }
    if (options.headers) {
      client.setHeaders(options.headers)
    }
    return client
  }

  static get(url: string, query?: QueryObject) {
    return Client.make("GET", url, { query }).do()
  }
  static post(url: string, options: RequestOptions = {}) {
    return Client.make("POST", url, options).do()
  }
  static put(url: string, options: RequestOptions = {}) {
    return Client.make("PUT", url, options).do()
  }
  static patch(url: string, options: RequestOptions = {}) {
    return Client.make("PATCH", url, options).do()
  }
  static delete(url: string, query?: QueryObject) {
    return Client.make("DELETE", url, { query }).do()
  }

  static get Async() {
    return true
  }
}
