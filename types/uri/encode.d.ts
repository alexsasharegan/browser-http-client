export declare type Primitives = string | number | boolean;
export declare type PrimitiveArray = string[] | number[] | boolean[];
export declare type QueryObject = {
    [index: string]: Primitives | PrimitiveArray;
};
export declare function encodeQueryObj(query: QueryObject): string;
