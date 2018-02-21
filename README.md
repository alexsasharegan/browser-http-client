# browser-http-client

[![npm](https://img.shields.io/npm/v/browser-http-client.svg?style=for-the-badge)](https://img.shields.io/npm/v/browser-http-client)
[![npm downloads](https://img.shields.io/npm/dt/browser-http-client.svg?style=for-the-badge)](https://www.npmjs.com/package/browser-http-client)
[![GitHub issues](https://img.shields.io/github/issues/alexsasharegan/browser-http-client.svg?style=for-the-badge)](https://github.com/alexsasharegan/browser-http-client/issues)
[![GitHub stars](https://img.shields.io/github/stars/alexsasharegan/browser-http-client.svg?style=for-the-badge)](https://github.com/alexsasharegan/browser-http-client/stargazers)
[![GitHub license](https://img.shields.io/github/license/alexsasharegan/browser-http-client.svg?style=for-the-badge)](https://github.com/alexsasharegan/browser-http-client/blob/master/LICENSE.md)

A lightweight, browser-specific, strongly typed XHR client. Meant for usage with
TypeScript.

```sh
# npm 5 and up saves deps by default
npm i browser-http-client

# alternately with yarn
yarn add browser-http-client
```

## v3.x

Version 3 adds an opinionated twist to doing ajax. All requests now return a
wrapper type known as a Result. A Result type holds either an `Ok<T>` or an
`Err<E>` (where `T` and `E` are generic type variables that hold the type of
whatever you're wrapping). Thanks to the
[safe-types](https://github.com/alexsasharegan/safe-types) lib, the Result comes
with many methods that allow perform operations of the Ok and Err values with
safety because it matches the case under the hood and provides type-safe control
flow.

This change to using result types can simplify the successful path for our
programs, as well as provide consistency for the error states our program can
exist in. Given that an XHR can error in a number of ways, the pseudo pattern
match available on the ClientError type makes declaratively handling all those
possibilities much easier.

## Purpose

Modern web applications require extensive use of ajax calls, but for basic CRUD
operations, the calls are fairly simple. Feature rich clients like `$.ajax`,
[axios](https://github.com/axios/axios) and
[superagent](https://github.com/visionmedia/superagent) offer very nice APIs,
but many of their features go unused. It's also very common for ajax clients to
support both browser and server in the same package. All this means shipping
unnecessary code to our end users.

This library is modeled after familiar client APIs, but in a no-frills manner.
It's a basic XHR client for the browser only, while still providing a convenient
abstraction for the 80% use-case of ajax requests. It's written in TypeScript to
help provide a stable package as well as a better development experience when
consuming its APIs. Many of the hacks to support older browsers have been
dropped in favor of an >=ES5 compatible codebase

* _Note: a compatibility check is performed when the lib is loaded, and an Error
  will be logged if required browser APIs are not present (thrown if
  `window.onerror` is defined, logged otherwise)._

Much of the code is adapted from the
[axios client](https://github.com/axios/axios). While it isn't a drop-in
replacement for axios, the APIs and data structures are very similar. If you
choose to build your application using this package, then decide to upgrade to
axios in the future, the similarities will make refactoring relatively easy.

## Usage

`browser-http-client` has a dependency on `safe-types` and is built for ESM
only.

\*_Note: TypeScript users can dig into the package to access an enum/map of Http
status codes as registered with IANA. This is not part of the default build as
it requires your build tooling to compile from source._

```js
import { Status } from "browser-http-client/src/xhr/status.ts";
```

### Example

```js
import { Client } from "browser-http-client";

Client.get("https://api.github.com/users/alexsasharegan/repos").then(result =>
  result
    // Map over the Ok case of the result (called with the wrapped response)
    .map(({ headers, status, statusText, data }) => {
      console.log("Response headers:", headers);
      console.log(`Response status: ${statusText} [${status}]`);
      console.log("Response data:", data);
    })
    // Map over the Err case of the result. The error value has a discriminant
    // prop called `type` that allows for explicit error shape inference.
    // For example, XhrErr will contain the response, Abort will not, and Timeout
    // specifically receives the ProgressEvent type instead of the generic Event.
    // The error type is also imbued with a pseudo pattern matching method
    .map_err(err =>
      err.match({
        HttpStatusErr: statusErr => console.error(statusErr.response.data),
        XhrErr: err => console.error(err.event),
        Timeout: console.error,
        Abort: console.error,
      })
    )
);

// url: string, data?: object, options?: object
Client.post("/api/got/characters", {
  first_name: "John",
  last_name: "Snow",
  house: ["Stark", "Targaryen"],
});

// url: string, query?: object
Client.get("/api/got/characters", {
  last_name: "Snow",
  house: ["Stark", "Targaryen"],
});
// URL generated:
// - https://developer.github.com/api/got/characters?last_name=Snow&house[]=Stark&house[]=Targaryen
// * Note: undefined values are omitted from query strings.
```
