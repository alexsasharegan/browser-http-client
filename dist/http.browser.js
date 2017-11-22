window["Http"] =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });

// CONCATENATED MODULE: ./src/xhr/headers.ts
var ignoreDupeMap = {
    age: true,
    authorization: true,
    "content-length": true,
    "content-type": true,
    etag: true,
    expires: true,
    from: true,
    host: true,
    "if-modified-since": true,
    "if-unmodified-since": true,
    "last-modified": true,
    location: true,
    "max-forwards": true,
    "proxy-authorization": true,
    referer: true,
    "retry-after": true,
    "user-agent": true,
};
function Parse(headers, target) {
    if (!headers) {
        return;
    }
    var key, val, i, leadSp = /^\s*/, trailSp = /\s*$/;
    for (var _i = 0, _a = headers.split("\n"); _i < _a.length; _i++) {
        var line = _a[_i];
        i = line.indexOf(":");
        key = line
            .substr(0, i)
            .replace(leadSp, "")
            .replace(trailSp, "")
            .toLowerCase();
        val = line
            .substr(i + 1)
            .replace(leadSp, "")
            .replace(trailSp, "");
        if (key == "" || (target[key] !== undefined && ignoreDupeMap[key])) {
            continue;
        }
        if (key === "set-cookie") {
            if (!Array.isArray(target[key])) {
                target[key] = [];
            }
            ;
            target[key].push(val);
            continue;
        }
        if (target[key] !== undefined) {
            target[key] += ", " + val;
            continue;
        }
        target[key] = val;
    }
}

// CONCATENATED MODULE: ./src/encoding/url.ts
function EncodeQuery(data) {
    var encoded = [], e = encodeURIComponent, val = undefined, v = undefined, k = undefined;
    for (var _i = 0, _a = Object.keys(data); _i < _a.length; _i++) {
        k = _a[_i];
        val = data[k];
        if (typeof val == "function" || val === undefined) {
            continue;
        }
        if (Array.isArray(val)) {
            for (var _b = 0, val_1 = val; _b < val_1.length; _b++) {
                v = val_1[_b];
                if (v === undefined) {
                    continue;
                }
                encoded.push(e(k) + "[]=" + e(v.toString()));
            }
            continue;
        }
        encoded.push(e(k) + "=" + e(val.toString()));
    }
    return encoded.join("&");
}

// CONCATENATED MODULE: ./src/xhr/contentType.ts
var ContentType;
(function (ContentType) {
    ContentType["Json"] = "application/json";
    ContentType["Text"] = "text/plain";
    ContentType["Html"] = "text/html";
    ContentType["Form"] = "application/x-www-form-urlencoded";
    ContentType["Multipart"] = "multipart/form-data";
    ContentType["Stream"] = "application/octet-stream";
})(ContentType || (ContentType = {}));

// CONCATENATED MODULE: ./src/xhr/client.ts



function newResponse(xhr) {
    var r = Object.create(null);
    r.xhr = xhr;
    if (xhr.responseType == "text") {
        r.data = xhr.responseText;
    }
    else {
        r.data = xhr.response;
    }
    r.status = xhr.status;
    r.statusText = xhr.statusText;
    r.headers = Object.create(null);
    Parse(xhr.getAllResponseHeaders(), r.headers);
    return r;
}
var client_Client = (function () {
    function Client(method, url) {
        this.method = method;
        this.url = url;
        this.xhr = new XMLHttpRequest();
        this.headers = Object.assign(Object.create(null), Client.DefaultHeaders);
        this.data = null;
        this.responseType = Client.ResponseType;
        this.timeout = Client.Timeout;
        this.queryAdded = false;
    }
    Client.prototype.addHeaders = function (headers) {
        Object.assign(this.headers, headers);
    };
    Client.prototype.setHeaders = function (headers) {
        this.headers = Object.assign(Object.create(null), headers);
    };
    Client.prototype.addQueryString = function (query) {
        if (this.queryAdded) {
            throw new Error("Cannot add query string twice.");
        }
        this.url += "?";
        this.url += query;
        this.queryAdded = true;
    };
    Client.prototype.addQueryObject = function (query) {
        this.addQueryString(EncodeQuery(query));
    };
    Client.prototype.setData = function (data) {
        if (!data) {
            return;
        }
        if (data instanceof FormData || data instanceof Document) {
            this.data = data;
            return;
        }
        this.data = JSON.stringify(data);
        this.addHeaders({ "Content-Type": ContentType.Json });
    };
    Client.prototype.applyHeaders = function () {
        for (var header in this.headers) {
            if (!this.headers[header]) {
                continue;
            }
            this.xhr.setRequestHeader(header, this.headers[header]);
        }
    };
    Client.prototype.handleReadyStateChange = function (resolve, reject) {
        if (this.xhr.readyState !== XMLHttpRequest.DONE) {
            return;
        }
        var r = newResponse(this.xhr);
        if (this.xhr.status < 200 || this.xhr.status >= 400) {
            reject(r);
        }
        resolve(r);
    };
    Client.prototype.execute = function (resolve, reject) {
        this.xhr.open(this.method, this.url, Client.Async);
        this.xhr.responseType = this.responseType;
        this.xhr.timeout = this.timeout;
        this.applyHeaders();
        this.xhr.onreadystatechange = this.handleReadyStateChange.bind(this, resolve, reject);
        this.xhr.ontimeout = reject;
        this.xhr.onerror = reject;
        this.xhr.send(this.data);
    };
    Client.prototype.do = function () {
        return new Promise(this.execute.bind(this));
    };
    Client.make = function (method, url, options) {
        if (options === void 0) { options = {}; }
        var client = new Client(method, url);
        if (options.query) {
            client.addQueryObject(options.query);
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
    };
    Client.get = function (url, query) {
        return Client.make("GET", url, { query: query }).do();
    };
    Client.post = function (url, data, options) {
        if (options === void 0) { options = {}; }
        options.data = data;
        return Client.make("POST", url, options).do();
    };
    Client.put = function (url, data, options) {
        if (options === void 0) { options = {}; }
        options.data = data;
        return Client.make("PUT", url, options).do();
    };
    Client.patch = function (url, data, options) {
        if (options === void 0) { options = {}; }
        options.data = data;
        return Client.make("PATCH", url, options).do();
    };
    Client.delete = function (url, query) {
        return Client.make("DELETE", url, { query: query }).do();
    };
    Client.setResponseType = function (type) {
        Client.ResponseType = type;
    };
    Client.Timeout = 0;
    Client.ResponseType = "json";
    Client.Async = true;
    Client.DefaultHeaders = {
        Accept: ContentType.Json,
        "X-Requested-With": "XMLHttpRequest",
    };
    return Client;
}());


// CONCATENATED MODULE: ./src/index.ts
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "Client", function() { return client_Client; });

var key = "", err = null, compatChecks = Object.create(null);
compatChecks.XMLHttpRequest = "XMLHttpRequest" in window;
compatChecks.Promise = "Promise" in window;
compatChecks.FormData = "FormData" in window;
compatChecks["Array.isArray"] = typeof Array.isArray == "function";
compatChecks["Object.assign"] = typeof Object.assign == "function";
compatChecks["Object.keys"] = typeof Object.keys == "function";
compatChecks["Object.create"] = typeof Object.create == "function";
for (key in compatChecks) {
    if (compatChecks[key]) {
        continue;
    }
    err = new Error("[browser-http-client] A required API is not available in the browser: " + key);
    if (typeof window.onerror == "function") {
        window.onerror(err.message, err.fileName, err.lineNumber, err.columnNumber, err);
    }
    console.error(err);
}

var Http = { Client: client_Client };
/* harmony default export */ var src = __webpack_exports__["default"] = (Http);


/***/ })
/******/ ])["default"];
//# sourceMappingURL=http.browser.js.map