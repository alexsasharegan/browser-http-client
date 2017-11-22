import * as headers from "./headers"
import * as url from "../encoding/url"
import { ContentType } from "./contentType"

export interface RequestOptions {
	query?: url.QueryObject
	data?: RequestData
	headers?: headers.HttpHeaders
	responseType?: XMLHttpRequestResponseType
	timeout?: number
}

export type RequestData = { [key: string]: any } | FormData | Document
export type RequestBody = string | FormData | Document

export interface Response {
	data: any
	status: number
	statusText: string
	headers: object
	xhr: XMLHttpRequest
}

function newResponse(xhr: XMLHttpRequest): Response {
	let r = Object.create(null)

	r.xhr = xhr

	if (xhr.responseType == "text") {
		r.data = xhr.responseText
	} else {
		r.data = xhr.response
	}

	r.status = xhr.status
	r.statusText = xhr.statusText
	r.headers = Object.create(null)
	headers.Parse(xhr.getAllResponseHeaders(), r.headers)

	return r
}

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
	public static Async: boolean = true

	public static DefaultHeaders = {
		Accept: ContentType.Json,
		"X-Requested-With": "XMLHttpRequest",
	}

	private xhr: XMLHttpRequest = new XMLHttpRequest()
	private headers: headers.HttpHeaders = Object.assign(Object.create(null), Client.DefaultHeaders)
	private data: RequestBody = null
	private query: string
	private responseType: XMLHttpRequestResponseType = Client.ResponseType
	private timeout: number = Client.Timeout
	private queryAdded: boolean = false

	constructor(private method: string, private url: string) {}

	/**
	 * Adds an object of headers via `Object.assign` that will be written to the XHR.
	 */
	addHeaders(headers: headers.HttpHeaders): void {
		Object.assign(this.headers, headers)
	}
	/**
	 * Sets a new object of headers that will be written to the XHR.
	 */
	setHeaders(headers: headers.HttpHeaders): void {
		this.headers = Object.assign(Object.create(null), headers)
	}
	addQueryString(query: string): void {
		if (this.queryAdded) {
			throw new Error("Cannot add query string twice.")
		}
		this.url += "?"
		this.url += query
		this.queryAdded = true
	}
	addQueryObject(query: url.QueryObject): void {
		this.addQueryString(url.EncodeQuery(query))
	}

	private setData(data: RequestData): void {
		if (!data) {
			return
		}
		if (data instanceof FormData || data instanceof Document) {
			this.data = data
			return
		}
		this.data = JSON.stringify(data)
		this.addHeaders({ "Content-Type": ContentType.Json })
	}
	private applyHeaders(): void {
		for (const header in this.headers) {
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

		let r = newResponse(this.xhr)
		if (this.xhr.status < 200 || this.xhr.status >= 400) {
			reject(r)
		}

		resolve(r)
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
		if (options.data) {
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

	public static get(url: string, query?: url.QueryObject): Promise<Response> {
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
	public static delete(url: string, query?: url.QueryObject): Promise<Response> {
		return Client.make("DELETE", url, { query }).do()
	}

	public static setResponseType(type: XMLHttpRequestResponseType): void {
		Client.ResponseType = type
	}
}
