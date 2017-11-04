import { Client } from "./xhr/client"
import { Code, Text } from "./xhr/status"

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
  throw new Error(`Required ${key} is not available in the browser`)
}

export { Client, Code, Text }
