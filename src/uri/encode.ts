export type Primitives = string | number | boolean
export type PrimitiveArray = string[] | number[] | boolean[]
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
  const q = []
  for (const key of Object.keys(query)) {
    q.push(encodeKeyValue(key, query[key]))
  }
  return q.join("&")
}
