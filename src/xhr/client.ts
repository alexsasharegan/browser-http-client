export enum ReadyStates {
  Unsent = 0,
  Opened = 1,
  HeadersReceived = 2,
  Loading = 3,
  Done = 4
}

export class Client {
  private headers = {
    Accept: "application/json",
    "Cache-Control": "no-cache",
    "X-Requested-With": "XMLHttpRequest"
  }

  private xhr: XMLHttpRequest

  constructor() {
    this.xhr = new XMLHttpRequest()
  }

  setHeaders(headers: object): this {
    return Object.assign(this, { headers })
  }

  on(event: string, callback: EventListenerOrEventListenerObject): void {
    this.xhr.addEventListener(event, callback)
  }

  static Get(url: string, query = {}) {
    //
  }
  static Post(url: string, options = {}) {
    //
  }
  static Put(url: string, options = {}) {
    //
  }
  static Delete(url: string, query = {}) {
    //
  }
}
