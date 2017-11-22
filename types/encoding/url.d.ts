export declare type Primitives = string | number | boolean | null;
export declare type PrimitiveArray = string[] | number[] | boolean[] | null[];
export declare type QueryObject = {
    [index: string]: Primitives | PrimitiveArray;
};
export declare function EncodeQuery(data: QueryObject): string;
