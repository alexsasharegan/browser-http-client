import { Client } from "./xhr/client"

type Dictionary<T> = { [key: string]: T }

let key = "",
	err = null,
	compatChecks: Dictionary<boolean> = Object.create(null)

compatChecks.XMLHttpRequest = "XMLHttpRequest" in window
compatChecks.Promise = "Promise" in window
compatChecks.FormData = "FormData" in window
compatChecks["Array.isArray"] = typeof Array.isArray == "function"
compatChecks["Object.assign"] = typeof Object.assign == "function"
compatChecks["Object.keys"] = typeof Object.keys == "function"
compatChecks["Object.create"] = typeof Object.create == "function"

for (key in compatChecks) {
	if (compatChecks[key]) {
		continue
	}
	err = new Error(`[browser-http-client] A required API is not available in the browser: ${key}`)
	if (typeof window.onerror == "function") {
		window.onerror(err.message, (err as any).fileName, (err as any).lineNumber, (err as any).columnNumber, err)
	}
	console.error(err)
}

// Export sub-modules for ESM
export { Client }

// Export a wrapper object for browser.
const Http = { Client }
export default Http
