(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Http"] = factory();
	else
		root["Http"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
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

// CONCATENATED MODULE: ./src/uri/encode.ts
function encodeKeyValue(k, v) {
    k = encodeURIComponent(k);
    if (v === void 0) {
        return "";
    }
    if (Array.isArray(v)) {
        return v.map(function (x) { return k + "[]=" + encodeURIComponent(x.toString()); }).join("&");
    }
    return k + "=" + encodeURIComponent(v.toString());
}
function encodeQueryObj(query) {
    var q = [];
    for (var _i = 0, _a = Object.keys(query); _i < _a.length; _i++) {
        var key = _a[_i];
        q.push(encodeKeyValue(key, query[key]));
    }
    return q.join("&");
}

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
    "user-agent": true
};
function trim(str) {
    return str.replace(/^\s*/, "").replace(/\s*$/, "");
}
function parseHeaders(headers) {
    if (!headers) {
        return {};
    }
    var parsed = {};
    var key;
    var val;
    var i;
    for (var _i = 0, _a = headers.split("\n"); _i < _a.length; _i++) {
        var line = _a[_i];
        i = line.indexOf(":");
        key = trim(line.substr(0, i)).toLowerCase();
        val = trim(line.substr(i + 1));
        if (!key || (parsed.hasOwnProperty(key) && ignoreDupeMap[key])) {
            continue;
        }
        if (key === "set-cookie") {
            if (!parsed.hasOwnProperty(key)) {
                parsed[key] = [];
            }
            parsed[key] = parsed[key].concat([val]);
            continue;
        }
        parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
    }
    return parsed;
}

// CONCATENATED MODULE: ./src/xhr/response.ts
var Response = (function () {
    function Response() {
    }
    return Response;
}());


// CONCATENATED MODULE: ./src/xhr/client.ts



var client_Client = (function () {
    function Client(method, url) {
        this.data = null;
        this.responseType = Client.ResponseType;
        this.timeout = Client.Timeout;
        this.queryAdded = false;
        Object.assign(this, {
            method: method,
            url: url,
            headers: Object.assign({}, Client.DefaultHeaders),
            xhr: new XMLHttpRequest()
        });
    }
    Client.prototype.setHeaders = function (headers) {
        Object.assign(this.headers, headers);
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
        this.addQueryString(encodeQueryObj(query));
    };
    Client.prototype.setData = function (data) {
        if (!data) {
            return;
        }
        if (data instanceof FormData || data instanceof Document) {
            this.data = data;
        }
        this.data = JSON.stringify(data);
    };
    Client.prototype.applyHeaders = function () {
        for (var _i = 0, _a = Object.keys(this.headers); _i < _a.length; _i++) {
            var header = _a[_i];
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
        var response = new Response();
        response.data = this.xhr.responseType == "text" ? this.xhr.responseText : this.xhr.response;
        response.status = this.xhr.status;
        response.statusText = this.xhr.statusText;
        response.headers = parseHeaders(this.xhr.getAllResponseHeaders());
        response.xhr = this.xhr;
        if (this.xhr.status < 200 || this.xhr.status >= 400) {
            reject(response);
        }
        resolve(response);
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
        if (method != "GET" && options.data) {
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
    Object.defineProperty(Client, "Async", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Client.Timeout = 0;
    Client.ResponseType = "json";
    Client.DefaultHeaders = {
        Accept: "application/json",
        "Cache-Control": "no-cache",
        "X-Requested-With": "XMLHttpRequest"
    };
    return Client;
}());


// CONCATENATED MODULE: ./src/index.ts
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "Client", function() { return client_Client; });

var compatChecks = {
    XMLHttpRequest: "XMLHttpRequest" in window,
    Promise: "Promise" in window,
    FormData: "FormData" in window,
    "Array.isArray": typeof Array.isArray == "function",
    "Object.assign": typeof Object.assign == "function",
    "Object.keys": typeof Object.keys == "function"
};
for (var key in compatChecks) {
    if (!compatChecks.hasOwnProperty(key) || compatChecks[key]) {
        continue;
    }
    var err = new Error("[browser-http-client] Required " + key + " is not available in the browser");
    if (typeof window.onerror == "function") {
        throw err;
    }
    else {
        console.error(err);
    }
}

var Http = { Client: client_Client };
/* harmony default export */ var src = __webpack_exports__["default"] = (Http);


/***/ })
/******/ ]);
});
//# sourceMappingURL=http.umd.js.map