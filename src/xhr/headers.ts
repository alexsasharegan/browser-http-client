export type Dictionary<T> = { [key: string]: T }

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
  "user-agent": true
}

/**
 * Removes all leading and trailing white space characters.
 */
function trim(str: string): string {
  return str.replace(/^\s*/, "").replace(/\s*$/, "")
}

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 */
export function parseHeaders(headers: string): object {
  if (!headers) {
    return {}
  }

  const parsed: { [key: string]: any } = {}
  let key: string
  let val: string
  let i: number

  for (const line of headers.split("\n")) {
    i = line.indexOf(":")
    key = trim(line.substr(0, i)).toLowerCase()
    val = trim(line.substr(i + 1))

    // Skip empty keys and defined items in the ignore list.
    if (!key || (parsed.hasOwnProperty(key) && ignoreDupeMap[key])) {
      continue
    }
    if (key === "set-cookie") {
      if (!parsed.hasOwnProperty(key)) {
        parsed[key] = []
      }
      parsed[key] = parsed[key].concat([val])
      continue
    }

    parsed[key] = parsed[key] ? parsed[key] + ", " + val : val
  }

  return parsed
}
