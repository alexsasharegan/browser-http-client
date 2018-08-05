export type Dictionary<T> = { [key: string]: T };

const ignoreDupeMap: Dictionary<boolean> = {
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

/**
 * Parse headers into the target object.
 *
 * ```
 * const resHeaders =
 * `Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked`
 *
 * parseHeaders(resHeaders)
 * // Output:
 * { date: 'Wed, 27 Aug 2014 08:58:49 GMT',
 *  'content-type': 'application/json',
 *  connection: 'keep-alive',
 *  'transfer-encoding': 'chunked' }
 * ```
 */
export function parse(
  headers: string,
  target_mut: { [key: string]: string | string[] }
): { [field: string]: string | string[] } {
  if (!headers) {
    return target_mut;
  }

  let line: string;
  let key: string;
  let val: string;
  let i: number;
  let lead_sp = /^\s*/;
  let trail_sp = /\s*$/;

  for (line of headers.split("\n")) {
    i = line.indexOf(":");
    key = line
      .substr(0, i)
      .replace(lead_sp, "")
      .replace(trail_sp, "")
      .toLowerCase();
    val = line
      .substr(i + 1)
      .replace(lead_sp, "")
      .replace(trail_sp, "");

    // Skip empty keys and defined items in the ignore list.
    if (key == "" || (target_mut[key] !== undefined && ignoreDupeMap[key])) {
      continue;
    }

    if (key === "set-cookie") {
      // Normalize to array
      if (!Array.isArray(target_mut[key])) {
        target_mut[key] = [];
      }
      // TS needs a var alloc to infer type, so force the type
      (target_mut[key] as string[]).push(val);
      continue;
    }

    // These keys can have multiple values
    if (target_mut[key] !== undefined) {
      target_mut[key] += ", " + val;
      continue;
    }

    target_mut[key] = val;
  }

  return target_mut;
}

export interface HttpHeaders {
  Accept?: string;
  ["Access-Control-Allow-Origin"]?: string;
  ["Access-Control-Allow-Credentials"]?: string;
  ["Access-Control-Expose-Headers"]?: string;
  ["Access-Control-Max-Age"]?: string;
  ["Access-Control-Allow-Methods"]?: string;
  ["Access-Control-Allow-Headers"]?: string;
  ["Accept-Patch"]?: string;
  ["Accept-Ranges"]?: string;
  Age?: string;
  Allow?: string;
  ["Alt-Svc"]?: string;
  ["Cache-Control"]?: string;
  connection?: string;
  ["Content-Disposition"]?: string;
  ["Content-Encoding"]?: string;
  ["Content-Language"]?: string;
  ["Content-Length"]?: string;
  ["Content-Location"]?: string;
  ["Content-Range"]?: string;
  ["Content-Type"]?: string;
  Date?: string;
  Expires?: string;
  Host?: string;
  ["Last-Modified"]?: string;
  Location?: string;
  Pragma?: string;
  ["Proxy-Authenticate"]?: string;
  ["Public-Key-Pins"]?: string;
  ["Retry-After"]?: string;
  ["Set-Cookie"]?: string;
  ["Strict-Transport-Security"]?: string;
  Trailer?: string;
  ["Transfer-Encoding"]?: string;
  Tk?: string;
  Upgrade?: string;
  Vary?: string;
  Via?: string;
  Warning?: string;
  ["Www-Authenticate"]?: string;
  [header: string]: string | undefined;
}
