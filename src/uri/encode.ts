type Primitives = string | number | boolean
type PrimitiveArray = string[] | number[] | boolean[]
export type QueryObject = { [index: string]: Primitives | PrimitiveArray }

function encodeKeyValue(k: string, v: Primitives | PrimitiveArray): string {
  k = encodeURIComponent(k)
  if (v === void 0) {
    return ""
  }
  if (Array.isArray(v)) {
    return (v as any[]).map(x => `${k}[]=${encodeURIComponent(x.toString())}`).join("&")
  }
  return `${k}=${encodeURIComponent(v.toString())}`
}

export function encodeQueryObj(query: QueryObject): string {
  let q = ""
  for (const key of Object.keys(query)) {
    q += encodeKeyValue(key, query[key])
  }
  return q
}
