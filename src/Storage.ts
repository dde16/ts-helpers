/** Local Storage declaration merge */
declare interface Storage {
    has(key: string): boolean;
    gets(...keys: string[]): Entries<string>;

    get(key: string, fallback?: string): string|undefined;
    set(key: string, value: string): void;
    remove(key: string): void;
}

Storage.prototype.has = function(key: string): boolean {
    let storageLength = this.length;

    for(let storageIndex = 0; storageIndex < storageLength; storageIndex++) {
        let storageKey = this.key(storageIndex);

        if(key === storageKey) return true;
    }

    return false;
};

Storage.prototype.gets = function(...keys: string[]): Entries<string|undefined> {
    let values: Entries<string|undefined> = {};

    for(let index = 0; index < keys.length; index++) {
        let key = keys[index];

        values[key] = this.get(key);
    }

    return values;
};

Storage.prototype.get = function(key: string, fallback?: string): string|undefined {
    return this.has(key) ? (this.getItem(key) ?? undefined) : fallback;
};

Storage.prototype.set    = Storage.prototype.setItem;
Storage.prototype.remove = Storage.prototype.removeItem;