# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="3.2.0"></a>
# [3.2.0](https://github.com/alexsasharegan/browser-http-client/compare/v3.1.1...v3.2.0) (2018-08-05)


### Features

* response headers are parsed lazily ([0507a43](https://github.com/alexsasharegan/browser-http-client/commit/0507a43))



<a name="3.1.1"></a>
## [3.1.1](https://github.com/alexsasharegan/browser-http-client/compare/v3.1.0...v3.1.1) (2018-02-23)



<a name="3.1.0"></a>
# [3.1.0](https://github.com/alexsasharegan/browser-http-client/compare/v3.0.0...v3.1.0) (2018-02-23)


### Features

* **client:** adds comments for intellisense ([9b074b2](https://github.com/alexsasharegan/browser-http-client/commit/9b074b2))



<a name="3.0.0"></a>
# [3.0.0](https://github.com/alexsasharegan/browser-http-client/compare/v3.0.0-beta.1...v3.0.0) (2018-02-22)


### Features

* **client:** adds new generic for bad request response type ([2e63388](https://github.com/alexsasharegan/browser-http-client/commit/2e63388))



<a name="3.0.0-beta.1"></a>
# [3.0.0-beta.1](https://github.com/alexsasharegan/browser-http-client/compare/v3.0.0-beta.0...v3.0.0-beta.1) (2018-02-21)


### Bug Fixes

* **client:** fixes err match to call match fn with proper type ([17ce8f4](https://github.com/alexsasharegan/browser-http-client/commit/17ce8f4))



<a name="3.0.0-beta.0"></a>
# [3.0.0-beta.0](https://github.com/alexsasharegan/browser-http-client/compare/v2.0.0...v3.0.0-beta.0) (2018-02-21)


### Features

* **3.0.0:** enrich API with Result wrapper type ([df64d7f](https://github.com/alexsasharegan/browser-http-client/commit/df64d7f))


### BREAKING CHANGES

* **3.0.0:** all return types are now wrapped in Result types
* **3.0.0:** promises do not reject, they use Err types

* feat(client): pattern match err type

* chore: clean up old deps

* feat(client): adds event listener proxying
* **3.0.0:** renames Client.make => Client.create
* **3.0.0:** renames Client.do => Client.request

* Client class now holds the generic type
* adds `addEventListener` proxy to XMLHttpRequest
* adds `addUploadEventListener` proxy to XMLHttpRequestUpload
* adds xhr to all ClientError types

* chore: testing bootstrap

* feat(qstr): adds 100% cov

* fix(client): fix abort err
* **3.0.0:** rename Client.request => Client.send

* feat(client): adds testing and concats `charset` to content type

* chore(docs): add a v3 explanation



<a name="2.0.0"></a>
# [2.0.0](https://github.com/alexsasharegan/browser-http-client/compare/v1.3.2...v2.0.0) (2018-02-17)


### Features

* use rollup for smaller bundle ([a5b1154](https://github.com/alexsasharegan/browser-http-client/commit/a5b1154))


### BREAKING CHANGES

* removed default export
* only esm or umd bundles
* use UN-minified builds by default
* ignore dist folder



<a name="1.3.2"></a>
## [1.3.2](https://github.com/alexsasharegan/browser-http-client/compare/v1.3.1...v1.3.2) (2017-11-22)



<a name="1.3.1"></a>
## [1.3.1](https://github.com/alexsasharegan/browser-http-client/compare/v1.3.0...v1.3.1) (2017-11-06)



<a name="1.3.0"></a>
# [1.3.0](https://github.com/alexsasharegan/browser-http-client/compare/v1.2.0...v1.3.0) (2017-11-05)


### Features

* **build:** add UMD build and use as main ([231c3a5](https://github.com/alexsasharegan/browser-http-client/commit/231c3a5))



<a name="1.2.0"></a>
# [1.2.0](https://github.com/alexsasharegan/browser-http-client/compare/v1.1.0...v1.2.0) (2017-11-05)


### Features

* add source maps ([127285c](https://github.com/alexsasharegan/browser-http-client/commit/127285c))



<a name="1.1.0"></a>
# [1.1.0](https://github.com/alexsasharegan/browser-http-client/compare/v1.0.5...v1.1.0) (2017-11-05)


### Features

* reduce lib size ([826af88](https://github.com/alexsasharegan/browser-http-client/commit/826af88))



<a name="1.0.5"></a>
## [1.0.5](https://github.com/alexsasharegan/browser-http-client/compare/v1.0.4...v1.0.5) (2017-11-05)


### Bug Fixes

* **uri/encode:** fix query string elm concat ([4c3615b](https://github.com/alexsasharegan/browser-http-client/commit/4c3615b))



<a name="1.0.4"></a>
## [1.0.4](https://github.com/alexsasharegan/browser-http-client/compare/v1.0.3...v1.0.4) (2017-11-04)



<a name="1.0.3"></a>
## [1.0.3](https://github.com/alexsasharegan/browser-http-client/compare/v1.0.2...v1.0.3) (2017-11-04)



<a name="1.0.2"></a>
## [1.0.2](https://github.com/alexsasharegan/browser-http-client/compare/v1.0.1...v1.0.2) (2017-11-04)


### Bug Fixes

* **xhr/client:** bind resolve/reject to readystate handler ([87f9d5e](https://github.com/alexsasharegan/browser-http-client/commit/87f9d5e))



<a name="1.0.1"></a>
## [1.0.1](https://github.com/alexsasharegan/browser-http-client/compare/v1.0.0...v1.0.1) (2017-11-04)


### Bug Fixes

* correct package.json module paths ([964cbdf](https://github.com/alexsasharegan/browser-http-client/commit/964cbdf))



<a name="1.0.0"></a>
# 1.0.0 (2017-11-04)


### Bug Fixes

* **index:** log error instead of throw ([1bbcf73](https://github.com/alexsasharegan/browser-http-client/commit/1bbcf73))


### Features

* making progres ([f98053f](https://github.com/alexsasharegan/browser-http-client/commit/f98053f))
* scaffolding lib ([4395fa4](https://github.com/alexsasharegan/browser-http-client/commit/4395fa4))
