export type Primitives = string | number | boolean | null
export type PrimitiveArray = string[] | number[] | boolean[] | null[]
export type QueryObject = { [index: string]: Primitives | PrimitiveArray }

export function EncodeQuery(data: QueryObject) {
	let encoded = [],
		e = encodeURIComponent,
		val = undefined,
		v = undefined,
		k = undefined

	for (k of Object.keys(data)) {
		val = data[k]
		if (typeof val == "function" || val === undefined) {
			// Break QueryObject key iter for non encodable types.
			continue
		}

		if (Array.isArray(val)) {
			for (v of val) {
				if (v === undefined) {
					// Break inner array iter to omit writing undefined value.
					continue
				}
				encoded.push(e(k) + "[]=" + e(v.toString()))
			}
			// Continue to next QueryObject key.
			continue
		}

		encoded.push(e(k) + "=" + e(val.toString()))
	}

	return encoded.join("&")
}
