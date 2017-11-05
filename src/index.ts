import { Client } from "./xhr/client"
import { Status } from "./xhr/status"

type Dictionary<T> = { [key: string]: T }

const compatChecks: Dictionary<boolean> = {
  XMLHttpRequest: "XMLHttpRequest" in window,
  Promise: "Promise" in window,
  FormData: "FormData" in window,
  "Array.isArray": typeof Array.isArray == "function",
  "Object.assign": typeof Object.assign == "function",
  "Object.keys": typeof Object.keys == "function"
}

for (const key in compatChecks) {
  if (!compatChecks.hasOwnProperty(key) || compatChecks[key]) {
    continue
  }
  const err = new Error(`[browser-http-client] Required ${key} is not available in the browser`)
  if (typeof window.onerror == "function") {
    throw err
  } else {
    console.error(err)
  }
}

// Export sub-modules for ESM
export { Client, Status }

// Export a wrapper object for browser.
const Http = { Client, Status }
export default Http
