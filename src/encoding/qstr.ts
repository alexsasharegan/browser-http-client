export type Primitive = string | number | boolean | null;
export type PrimitiveArray = string[] | number[] | boolean[] | null[];
export type QueryObject = { [index: string]: Primitive | PrimitiveArray };

export function encode_query(data: QueryObject) {
  let encoded = [];
  let enc = encodeURIComponent;
  let val: any;
  let v: any;
  let k: string;

  for (k of Object.keys(data)) {
    val = data[k];
    if (typeof val == "function" || val === undefined) {
      // Skip QueryObject key iter for non encodable types.
      continue;
    }

    if (Array.isArray(val)) {
      for (v of val) {
        // Omit writing undefined value.
        if (v === undefined) {
          continue;
        }
        encoded.push(enc(k) + "[]=" + enc("" + v));
      }
      // Next QueryObject key.
      continue;
    }

    encoded.push(enc(k) + "=" + enc("" + val));
  }

  return encoded.join("&");
}
