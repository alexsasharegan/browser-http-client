# browser-http-client

A browser-specific, lightweight XHR client.

## Purpose

Modern XHR clients these days are trending towards isomorphic design. This makes for a comfortable API across client & server applications, but it also means shipping more code to our browser clients.

This library aims to provide a basic XHR client for the browser only. It's designed to occupy a small footprint in your browser bundle, while still providing a convenient abstraction for handling ajax requests.
