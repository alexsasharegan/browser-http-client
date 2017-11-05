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


// CONCATENATED MODULE: ./src/xhr/status.ts
var Status;
(function (Status) {
    Status[Status["Continue"] = 100] = "Continue";
    Status[Status["SwitchingProtocols"] = 101] = "SwitchingProtocols";
    Status[Status["Processing"] = 102] = "Processing";
    Status[Status["OK"] = 200] = "OK";
    Status[Status["Created"] = 201] = "Created";
    Status[Status["Accepted"] = 202] = "Accepted";
    Status[Status["NonAuthoritativeInfo"] = 203] = "NonAuthoritativeInfo";
    Status[Status["NoContent"] = 204] = "NoContent";
    Status[Status["ResetContent"] = 205] = "ResetContent";
    Status[Status["PartialContent"] = 206] = "PartialContent";
    Status[Status["MultiStatus"] = 207] = "MultiStatus";
    Status[Status["AlreadyReported"] = 208] = "AlreadyReported";
    Status[Status["IMUsed"] = 226] = "IMUsed";
    Status[Status["MultipleChoices"] = 300] = "MultipleChoices";
    Status[Status["MovedPermanently"] = 301] = "MovedPermanently";
    Status[Status["Found"] = 302] = "Found";
    Status[Status["SeeOther"] = 303] = "SeeOther";
    Status[Status["NotModified"] = 304] = "NotModified";
    Status[Status["UseProxy"] = 305] = "UseProxy";
    Status[Status["_"] = 306] = "_";
    Status[Status["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    Status[Status["PermanentRedirect"] = 308] = "PermanentRedirect";
    Status[Status["BadRequest"] = 400] = "BadRequest";
    Status[Status["Unauthorized"] = 401] = "Unauthorized";
    Status[Status["PaymentRequired"] = 402] = "PaymentRequired";
    Status[Status["Forbidden"] = 403] = "Forbidden";
    Status[Status["NotFound"] = 404] = "NotFound";
    Status[Status["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    Status[Status["NotAcceptable"] = 406] = "NotAcceptable";
    Status[Status["ProxyAuthRequired"] = 407] = "ProxyAuthRequired";
    Status[Status["RequestTimeout"] = 408] = "RequestTimeout";
    Status[Status["Conflict"] = 409] = "Conflict";
    Status[Status["Gone"] = 410] = "Gone";
    Status[Status["LengthRequired"] = 411] = "LengthRequired";
    Status[Status["PreconditionFailed"] = 412] = "PreconditionFailed";
    Status[Status["RequestEntityTooLarge"] = 413] = "RequestEntityTooLarge";
    Status[Status["RequestURITooLong"] = 414] = "RequestURITooLong";
    Status[Status["UnsupportedMediaType"] = 415] = "UnsupportedMediaType";
    Status[Status["RequestedRangeNotSatisfiable"] = 416] = "RequestedRangeNotSatisfiable";
    Status[Status["ExpectationFailed"] = 417] = "ExpectationFailed";
    Status[Status["Teapot"] = 418] = "Teapot";
    Status[Status["UnprocessableEntity"] = 422] = "UnprocessableEntity";
    Status[Status["Locked"] = 423] = "Locked";
    Status[Status["FailedDependency"] = 424] = "FailedDependency";
    Status[Status["UpgradeRequired"] = 426] = "UpgradeRequired";
    Status[Status["PreconditionRequired"] = 428] = "PreconditionRequired";
    Status[Status["TooManyRequests"] = 429] = "TooManyRequests";
    Status[Status["RequestHeaderFieldsTooLarge"] = 431] = "RequestHeaderFieldsTooLarge";
    Status[Status["UnavailableForLegalReasons"] = 451] = "UnavailableForLegalReasons";
    Status[Status["InternalServerError"] = 500] = "InternalServerError";
    Status[Status["NotImplemented"] = 501] = "NotImplemented";
    Status[Status["BadGateway"] = 502] = "BadGateway";
    Status[Status["ServiceUnavailable"] = 503] = "ServiceUnavailable";
    Status[Status["GatewayTimeout"] = 504] = "GatewayTimeout";
    Status[Status["HTTPVersionNotSupported"] = 505] = "HTTPVersionNotSupported";
    Status[Status["VariantAlsoNegotiates"] = 506] = "VariantAlsoNegotiates";
    Status[Status["InsufficientStorage"] = 507] = "InsufficientStorage";
    Status[Status["LoopDetected"] = 508] = "LoopDetected";
    Status[Status["NotExtended"] = 510] = "NotExtended";
    Status[Status["NetworkAuthenticationRequired"] = 511] = "NetworkAuthenticationRequired";
})(Status || (Status = {}));

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
        if (this.xhr.status < Status.OK || this.xhr.status >= Status.BadRequest) {
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
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "Status", function() { return Status; });


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

var Http = { Client: client_Client, Status: Status };
/* harmony default export */ var src = __webpack_exports__["default"] = (Http);


/***/ })
/******/ ])["default"];