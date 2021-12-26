declare interface ObjectConstructor {
    /**
     * Check whether an object is the subclass, or instance of, a given prototype or set of protoypes.
     * 
     * @param target 
     * @param prototypes 
     */
    isSubclassInstanceOf(target: {}, prototypes: Array<any>|String): boolean;

    /**
     * Check whetther an object is an instance of a given prototype or set of prototypes.
     * 
     * @param target
     * @param prototypes 
     */
    isInstanceOf(target: {}, prototypes: Array<any>|String): boolean;

    /**
     * Returns a function which returns an empty object.
     */
    factory(): {};

    /**
     * Determine the type for a given value
     * 
     * @param value 
     * @param verbose Whether to include additional information, such as an object's prototype or if a number is a float or string.
     */
    getType(value: any, verbose: boolean): String|Array<any>;

    /**
     * Clone a target recursively.
     * 
     * @param target 
     */
    deepClone(target: StringMap<any>|any[]): any;

    /**
     * Find a value in an object recursively.
     * 
     * @param obj 
     * @param callback 
     * @param path 
     * @param hash 
     */
    deepWhere(obj: {}, callback: Function, path: Array<string|number>, hash: WeakMap<Object, undefined>): any;

    /**
     * Find the first value that matches a callback in an object.
     * 
     * @param obj 
     * @param callback 
     */
    deepFirst(obj: {}, callback: Function): any;
    deepLast(obj: {}, callback: Function): any;
    firstEntry(obj: {}, ufilter: Function|undefined): Array<any>;
    firstKey(obj: {}, ufilter: Function|undefined): any;
    firstValue(obj: {}, ufilter: Function|undefined): any;
    first(obj: {}, ufilter: Function|undefined): any;
    lastEntry(obj: {}, ufilter: Function|undefined): Array<any>;
    lastKey(obj: {}, ufilter: Function|undefined): any;
    lastValue(obj: {}, ufilter: Function|undefined): any;
    last(obj: {}, ufilter: Function|undefined): any;
    clone(obj: {}): {};
    filter(obj: {}, filter: Function): {};
    isElement(obj: any): boolean;
    isEvent(obj: any): boolean;
    isObject(obj: any): boolean;
    isAnonymousObject(obj: any): boolean;
    isString(obj: any): boolean;
    isUndefined(obj: any): boolean;
    isSet(obj: any): boolean;
    isFunction(obj: any): boolean;
    isNumber(obj: any): boolean;
    isBoolean(obj: any): boolean;
    isBool(obj: any): boolean;
    isArray(obj: any): boolean;
    isScalar(obj: any): boolean;
    isSymbol(obj: any): boolean;
    dots(obj: {}, using: string, arrays?: boolean, path?: Array<any>): {};
    deepMap(target: {}, callback: Function, filter: Function|undefined, path?: Array<any>): {};
    deepAssign(target: {}, sources: Array<{}>, options: {}): {};
    only(target: {}, keys: Array<any>): {};
    except(target: {}, keys: Array<any>): {};
    forEach(target: {}, callback: Function): any;
    forEachAsync(target: {}, callback: Function): Promise<void>;
    sift(target: {}, keysets: Array<any>): {};
    map(obj: {}, callback: Function): {};
    mapAsync(obj: {}, callback: Function): {};
    get(last: {}|Array<any>, path: string|Array<string>, fallback: any): any;
    set(last: {}|Array<any>, path: string|Array<string>, value: any): any;
    order(obj: {}, order: Array<string|number>): {};

    flip(obj: {}): {};
}

Object.isSymbol = function(obj: any): boolean {
    return (typeof obj === "symbol");
};

Object.isScalar = function(obj: any): boolean {
    return (Object.isString(obj) || Object.isNumber(obj) || Object.isBool(obj) || Object.isSymbol(obj));
};

Object.flip = function(obj: {}): {} { 
    return Object.map(
        obj,
        function(key: string, value: any): any[] {
            if(!Object.isScalar(value))
                throw new Error("Cannot set non-scalar value to a key for " + key + ".");

            return [value, key];
        }
    );
}

Object.deepClone = function(target: StringMap<any>|any[]): any {
    var clone: StringMap<any>|any[];

    let cb = (value: any, key: string|number) => {
        if(Object.isObject(value) || Object.isArray(value))
            value = Object.deepClone(value as StringMap<any>);

        (clone as any[])[key as number] = value;
    };

    if(Object.isObject(target)) {
        clone = {};

        target = Object.assign({}, target);

        Object.forEach(target, cb);
    }
    else if(Object.isArray(target)) {
        clone = [];

        target = Array.fromObject(Object.assign({}, target));

        (target as any[]).forEach(cb);
    }
    else {
        clone = target;
    }

    return clone;
}

Object.isSubclassInstanceOf=  function(target: {}, prototypes: Array<any>|String): boolean {
        return (!Array.isArray(prototypes) ? [prototypes] : prototypes).first((prototype: any): boolean => target instanceof prototype);
};

Object.isInstanceOf=  function(target: {}, prototypes: Array<any>|String): boolean {
        return (!Array.isArray(prototypes) ? [prototypes] : prototypes).first((prototype: any): boolean => target instanceof prototype && target !== prototype);
};

Object.factory=  function(): {} {
        return {};
};

Object.getType=  function(value: any, verbose: boolean): String|Array<any> {
        let rootType: string = typeof(value);

        if(rootType === "object" && Object.isArray(value)) {
            rootType = "array";
        }
        else if(rootType === "number") {
            rootType = Number.isFloat(value) ? "float" : "int";
        }

        let subTypes = [];

        if(verbose) {
            switch(rootType) {
                case "object":
                    subTypes.push(value.prototype);
                    break;
            }
        }

        return !verbose ? rootType : [rootType, ...subTypes];
};

Object.deepWhere=  function(obj: {}, callback: Function, path: Array<string|number> = [], hash: WeakMap<{}, undefined> = new WeakMap()): any {
    let keys: Array<string|number> = Object.keys(obj);
    let matches: StringMap<any> = {};

    if(!hash.has(obj)) {
        hash.set(obj, undefined);
        
        if(Object.isObject(obj) && callback(obj))
            matches[path.join(".")] = obj as any;

        for(let index = 0; index < keys.length; index++) {
            let key   = keys[index];
            let value: any = obj[key] as any;
            let pathstack: Array<string|number>  = Object.assign([], path);
            pathstack.push(key);

            if(Object.isObject(value) || Object.isArray(value)) {
                matches = Object.assign(
                    matches,
                    Object.deepWhere(
                        value,
                        callback,
                        pathstack,
                        hash
                    )
                );
            }
        }
    }

    return matches;
};

Object.deepFirst=  function(obj: {}, callback: Function): any {
        let keys: Array<string|number> = Object.keys(obj);
        
        if(Object.isObject(obj) && callback(obj))
            return obj;

        for(let index: number = 0; index < keys.length; index++) {
            let key: string|number = keys[index];
            let value: any = obj[key];

            if(Object.isObject(value) || Object.isArray(value)) {
                let match = Object.deepFirst(value, callback);

                if(match) return match;
            }
        }
};

Object.deepLast=  function(obj: {}, callback: Function): any {
        let keys: Array<string|number> = Object.keys(obj);
        let match = undefined;
        let smatch = undefined;
        
        if(Object.isObject(obj) && callback(obj))
            return obj;

        for(let index = 0; index < keys.length; index++) {
            let key   = keys[index];
            let value = obj[key];

            if(Object.isObject(value) || Object.isArray(value)) {
                if(smatch = Object.deepLast(value, callback)) {
                    match = smatch;
                }
            }
        }

        return match;
};

Object.firstEntry=  function(obj: {}, ufilter: Function|undefined = undefined): Array<any> {
        let filter;

        if(ufilter) filter = ((entry: any) => ufilter(entry[0], entry[1]));

        return Object.entries(obj).first(filter);
};

Object.firstKey=  function(obj: {}, ufilter: Function|undefined = undefined): any {
        let first = Object.firstEntry(obj, ufilter);

        if(first) return first[0];
};

Object.firstValue=  function(obj: {}, ufilter: Function|undefined = undefined): any {
        let first = Object.firstEntry(obj, ufilter);

        if(first) return first[1];
};

Object.first=  function(obj: {}, ufilter: Function|undefined = undefined): any {
        let first = Object.firstEntry(obj, ufilter);

        if(first) return {[first[0]]: first[1]};
};

Object.lastEntry=  function(obj: {}, ufilter: Function|undefined = undefined): Array<any> {
        let filter;

        if(ufilter) filter = ((entry: any): boolean => ufilter(entry[0], entry[1]));

        return Object.entries(obj).last(filter);
};

Object.lastKey=  function(obj: {}, ufilter: Function|undefined = undefined): any {
        let last = Object.lastEntry(obj, ufilter);

        if(last) return last[0];
};

Object.lastValue=  function(obj: {}, ufilter: Function|undefined = undefined): any {
        let last = Object.lastEntry(obj, ufilter);

        if(last) return last[1];
};

Object.last=  function(obj: {}, ufilter: Function|undefined = undefined): any {
        let last = Object.lastEntry(obj, ufilter);

        if(last) return {[last[0]]: last[1]};
};

Object.clone=  function(obj: {}): {} {
        return (Object.assign({}, obj));
};

Object.filter=  function(obj: {}, filter: Function): {} {
        return Object.fromEntries(Object.entries(obj).filter((entry: any): boolean => filter(entry[0], entry[1])));
};

Object.isElement=  function(obj: any): boolean {
        return (obj !== undefined && (obj instanceof Element || obj instanceof HTMLDocument || obj instanceof HTMLElement) && obj.nodeType === 1);
};

Object.isEvent=  function(obj: any): boolean {
        return (obj !== undefined && obj instanceof Event);
};

Object.isObject=  function(obj: any): boolean {
        return(obj !== undefined && typeof(obj) === "object" && !Array.isArray(obj) && obj instanceof Object);
};

Object.isAnonymousObject = function(obj: any): boolean {
    return Object.isObject(obj) ? obj.__proto__ == Object.prototype : false;
};

Object.isString=  function(obj: any): boolean {
        return(obj !== undefined && typeof(obj) === "string");
};

Object.isUndefined=  function(obj: any): boolean {
        return (obj === undefined);
};

Object.isundefined=  function(obj: any): boolean {
        return (obj === undefined || obj === undefined);
};

Object.isSet=  function(obj: any): boolean {
        return (obj !== undefined && obj !== undefined);
};

Object.isFunction=  function(obj: any): boolean {
        return (obj !== undefined && obj instanceof Function);
};

Object.isNumber=  function(obj: any): boolean {
        return (obj !== undefined && !isNaN(obj) && typeof(obj) === "number");
};

Object.isBoolean=  function(obj: any): boolean {
        return (obj !== undefined && typeof(obj) === "boolean");
};

Object.isBool=  function(obj: any): boolean {
        return Object.isBoolean(obj);
};

Object.isArray=  function(obj: any): boolean {
        return Array.isArray(obj);
};

Object.dots=  function(obj: {}, using: string = ".", arrays: boolean = true,  path: Array<any> = []): {} {
        let keys: Array<string|number> = Object.keys(obj);
        let dots: StringMap<any> = {};

        for(let index = 0; index < keys.length; index++) {
            let key   = keys[index];
            let value = obj[key];
            let self = [...path, key];

            if(Object.isObject(value)) {
                dots = Object.assign(dots, Object.dots(value, using, arrays, self));
            }
            else if(Object.isArray(value) && arrays) {
                for(let arrayIndex = 0; arrayIndex < value.length; arrayIndex++) {
                    let arrayValue = value[arrayIndex];

                    dots[[self, arrayIndex.toString()].join(using)] = arrayValue;
                }
            }
            else {
                dots[self.join(using)] = value;
            }
        }

        return dots;
};

Object.deepMap=  function(target: {}, callback: Function, filter: Function|undefined = undefined, path: Array<any> = []): {} {
        if(Object.isObject(target)) {

            let keys: Array<string|number> = Object.keys(target);

            for(let index = 0; index < keys.length; index++) {
                let key   = keys[index];
                let value = target[key];
                let self  = path.concat([key]);

                let map = filter ? filter(value, target) : "map";

                if ((Object.isObject(value) || Object.isArray(value)) && map !== "ignore") {
                    value = Object.deepMap(value, callback, filter, self);
                }

                if(map === "map") {
                    value = callback(value, self);
                }

                target[key] = value;
            }
        }

        return target;
};

Object.deepAssign=  function(target: {}, sources: Array<{}>, options: {} = {}): {} {
        let output = Object.assign({}, target);

        for(let index = 0; index < sources.length; index++) {
            let source = sources[index];

            if(Object.isObject(source)) {
                for(let key in source) {
                    if(output[key]) {
                        if(Object.isObject(source[key])) {
                            output[key] = Object.deepAssign(
                                output[key],
                                [source[key]],
                                options
                            );
                        }
                        else if(Object.isArray(source[key]) && Object.isArray(output[key])) {
                            for(let _index = 0; _index < source[key].length; _index++) {
                                let _value = source[key][_index];

                                output[key].push(_value);
                            }

                            if(options?.uniqueArrays)
                                output[key] = output[key].unique();
                        }
                        else {
                            output = Object.assign(output, {
                                [key]: source[key]
                            });
                        }
                    }
                    else {
                        output = Object.assign(output, {
                            [key]: source[key]
                        });
                    }
                }
            }
            else {
                // throw new TypeError();
            }
        }

        return output;
};

Object.only=  function(target: Entries, keys: Array<any>): {} {
        const obj: Entries = {};

        keys.forEach((key: string|number, index: number) => {
            obj[key] = target[key];
        });

        return obj;
};

Object.except=  function(target: {}, keys: Array<any>): {} {
        return Object.only(target, Object.keys(target).filter((key: any): boolean => !keys.contains(key)));
};

Object.forEach =  function(target: Entries, callback: Function): any {
    let keys: (string|number)[] = Object.keys(target);

    for(let index = 0; index < keys.length; index++) {
        let key = keys[index];

        if(callback(target[key], key, index) != undefined)
            return;
    }
};

Object.forEachAsync  = async function(target: Entries, callback: Function): Promise<void> {
    let keys: (string|number)[] = Object.keys(target);
    let returned: any = undefined;

    for(let index = 0; index < keys.length; index++) {
        let key = keys[index];

        if((await Promise.normalise(callback(target[key], key, index))) != undefined)
            return;
    }
};

Object.sift=  function(target: {}, keysets: Array<any>): {} {
    const objects: Array<{}> = [];
    const aggrkeys = keysets.flat().unique();

    keysets.forEach((keyset, index) => {
        objects[index] = Object.only(target, keyset);
    });

    return [Object.except(target, aggrkeys), objects];
};

Object.map = function(obj: {}, callback: Function): {} {
    return Object.fromEntries(
        Object.entries(Object.deepClone(obj)).map(
            ([k, v], i) => callback(k, v, i)
        )
    );
};

Object.mapAsync = async function(obj: {}, callback: Function): Promise<{}> {
    return Object.fromEntries(
        await Promise.all(
            Object.entries(Object.deepClone(obj)).map(
                ([k, v], i) => Promise.normalise(callback(k, v, i))
            )
        )
    );
};

Object.get=  function(last: Entries|Array<any>, path: string|Array<string>, fallback: any): any {
        if(Object.isString(path)) path = (path as string).split(".");

        if(Object.isObject(last) && Object.isArray(path)) {
            if(path.length > 0) {
                let next: Entries = last;

                for(let index = 0; index < path.length; index++) {
                    let key = path[index];

                    if(next.hasOwnProperty(key)) next = next[key]; else break;

                    if(index === path.length - 1)
                        return next;
                }
            }
        }

        return Object.isFunction(fallback) ? fallback() : fallback;
};

Object.set=  function(last: Entries|Array<any>, path: string|Array<string>, value: any): any {
        if(Object.isString(path)) path = (path as string).split(".");

        if(Object.isObject(last) && Object.isArray(path)) {
            if(path.length > 0) {
                let next: Entries = last;

                for(let index = 0; index < path.length-1; index++) {
                    let key = path[index];

                    if(next.hasOwnProperty(key)) next = next[key]; else break;

                    if(index === path.length-2) {
                        next[key] = value;
                        return true;
                    }
                }
            }
        }

        return false;
};

Object.order=  function(obj: Entries, order: Array<string|number>): {} {
    let ordered: Entries = {};

    for(let index = 0; index < order.length; index++) {
        let key = order[index];
        let value = obj[key];

        if(value)
            ordered[key] = obj[key];
    }

    return ordered;
};