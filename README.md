# browser-http-client

A browser-specific, lightweight XHR client.

## Purpose

Modern web applications require extensive use of ajax calls, but for basic CRUD operations, the calls are fairly simple. Feature rich clients like `$.ajax`, [axios](https://github.com/axios/axios) and [superagent](https://github.com/visionmedia/superagent) offer very nice APIs, but many of their features go unused. It's also very common for ajax clients to support both browser and server in the same package. All this means shipping unnecessary code to our end users.

This library is modeled after familiar client APIs, but in a no-frills manner. It's a basic XHR client for the browser only, while still providing a convenient abstraction for the 80% use-case of ajax requests. It's written in TypeScript to help provide a stable package as well as a better development experience when consuming its APIs. Many of the hacks to support older browsers have been dropped in favor of an >=ES5 compatible codebase—a compatibility check is performed when the lib is loaded, and an Error will be logged if required browser APIs are not present.

Much of the code is adapted from the [axios client](https://github.com/axios/axios). While it isn't a drop-in replacement for axios, the APIs and data structures are very similar. If you choose to build your application using this package, then decide to upgrade to axios in the future, the similarities will make refactoring relatively easy.
