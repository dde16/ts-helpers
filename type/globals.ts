declare type StringMap<V> = {
    [key: string]: V
};

declare type NumberMap<V> = {
    [key: number]: V
};

declare type SymbolMap<V> = {
    [key: symbol]: V
};

declare type Nullable = undefined|null;

declare type Scalar = string|number|boolean|symbol;

declare type Entries<V = any> = {
    [key: Key]: V
};

declare type Key = string|number|symbol;