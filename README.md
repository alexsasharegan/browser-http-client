# browser-http-client

A browser-specific, lightweight XHR client.

**Size:** `7K (gzipped: 2.7K)`

```sh
# npm 5 and up saves deps by default
npm i browser-http-client

# alternately with yarn
yarn add browser-http-client
```

## Purpose

Modern web applications require extensive use of ajax calls, but for basic CRUD operations, the calls are fairly simple. Feature rich clients like `$.ajax`, [axios](https://github.com/axios/axios) and [superagent](https://github.com/visionmedia/superagent) offer very nice APIs, but many of their features go unused. It's also very common for ajax clients to support both browser and server in the same package. All this means shipping unnecessary code to our end users.

This library is modeled after familiar client APIs, but in a no-frills manner. It's a basic XHR client for the browser only, while still providing a convenient abstraction for the 80% use-case of ajax requests. It's written in TypeScript to help provide a stable package as well as a better development experience when consuming its APIs. Many of the hacks to support older browsers have been dropped in favor of an >=ES5 compatible codebase

* _Note: a compatibility check is performed when the lib is loaded, and an Error will be logged/thrown if required browser APIs are not present (thrown if `window.onerror` is defined, logged otherwise)._

Much of the code is adapted from the [axios client](https://github.com/axios/axios). While it isn't a drop-in replacement for axios, the APIs and data structures are very similar. If you choose to build your application using this package, then decide to upgrade to axios in the future, the similarities will make refactoring relatively easy.

## Usage

`browser-http-client` has zero dependencies and is built for two target environments:

1. Browser: available on the window as a global (`window.Http` or simply `Http`)
1. ESM Packaged Modules:
  ```js
  export {
    // Client is the XHR client and the heart of the library.
    Client,
    // Status is an enum/map of HTTP status codes as registered with IANA.
    Status,
  }
  ```

### Browser Example

```js
// This is copy/paste-able into your console.
// After the request logs, play around with the `Http` class.
document.head.appendChild(
  Object.assign(document.createElement("script"), {
    src: "https://unpkg.com/browser-http-client",
    onload() {
      // Github: Request header field Cache-Control is not allowed by Access-Control-Allow-Headers in preflight response.
      // - falsey values will not be set on the XHR.
      Http.Client.DefaultHeaders["Cache-Control"] = null
      Http.Client.get("https://api.github.com/users/alexsasharegan/repos").then(console.log, console.error)
    }
  })
)
```

### ESM Example

```js
import { Client } from "browser-http-client"

Client.get("https://api.github.com/users/alexsasharegan/repos")
  .then(res => {
    console.log("Response headers:", res.headers)
    console.log(`Response status: ${res.statusText} [${res.status}]`)
    console.log("Response data:", res.data)
  })
  .catch(console.error)

// url: string, data?: object, options?: object
Client.post("/api/got/characters", {
  first_name: "John",
  last_name: "Snow",
  house: ["Stark", "Targaryen"]
})

// url: string, query?: object
Client.get("/api/got/characters", {
  last_name: "Snow",
  house: ["Stark", "Targaryen"]
})
// URL generated:
// - https://developer.github.com/api/got/characters?last_name=Snow&house[]=Stark&house[]=Targaryen
// *Note: undefined values are omitted from query strings.
```
