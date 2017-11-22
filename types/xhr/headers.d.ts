export declare type Dictionary<T> = {
    [key: string]: T;
};
export declare function Parse(headers: string, target: {
    [key: string]: string | string[] | undefined;
}): void;
export interface HttpHeaders {
    Accept?: string;
    "Access-Control-Allow-Origin"?: string;
    "Access-Control-Allow-Credentials"?: string;
    "Access-Control-Expose-Headers"?: string;
    "Access-Control-Max-Age"?: string;
    "Access-Control-Allow-Methods"?: string;
    "Access-Control-Allow-Headers"?: string;
    "Accept-Patch"?: string;
    "Accept-Ranges"?: string;
    Age?: string;
    Allow?: string;
    "Alt-Svc"?: string;
    "Cache-Control"?: string;
    connection?: string;
    "Content-Disposition"?: string;
    "Content-Encoding"?: string;
    "Content-Language"?: string;
    "Content-Length"?: string;
    "Content-Location"?: string;
    "Content-Range"?: string;
    "Content-Type"?: string;
    Date?: string;
    Expires?: string;
    Host?: string;
    "Last-Modified"?: string;
    Location?: string;
    Pragma?: string;
    "Proxy-Authenticate"?: string;
    "Public-Key-Pins"?: string;
    "Retry-After"?: string;
    "Set-Cookie"?: string;
    "Strict-Transport-Security"?: string;
    Trailer?: string;
    "Transfer-Encoding"?: string;
    Tk?: string;
    Upgrade?: string;
    Vary?: string;
    Via?: string;
    Warning?: string;
    "Www-Authenticate"?: string;
    [header: string]: string | undefined;
}
