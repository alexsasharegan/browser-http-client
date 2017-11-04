import { Client } from "./xhr/client"
import { Status } from "./xhr/status"
import { ContentType } from "./xhr/contentType"

type Dictionary<T> = { [key: string]: T }

const compatChecks: Dictionary<boolean> = {
  XMLHttpRequest: "XMLHttpRequest" in window,
  Promise: "Promise" in window,
  "Array.isArray": typeof Array.isArray == "function",
  "Object.assign": typeof Object.assign == "function",
  "Object.keys": typeof Object.keys == "function"
}

for (const key in compatChecks) {
  if (!compatChecks.hasOwnProperty(key) || compatChecks[key]) {
    continue
  }
  console.error(new Error(`Required ${key} is not available in the browser`))
}

// Export sub-modules for ESM
export { Client, Status, ContentType }

// Export a wrapper object for browser.
const Http = { Client, Status, ContentType }
export default Http
