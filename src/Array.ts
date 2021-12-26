/** Declaration merge */
declare interface Array<T> {
    __filter: Function;

    toggle: (value: any) => void;

    unique: () => any[];
    mean: () => number;

    firstEntry: (filter: Function|undefined) => undefined|any[];
    firstKey: (filter: Function|undefined) => number;
    first: (filter: Function|undefined) => any;

    lastEntry: (filter: Function|undefined) => undefined|any[];
    lastKey: (filter: Function|undefined) => number;
    last: (filter: Function|undefined) => any;

    removeFirst(filter: Function|undefined): void;
    removeLast(filter: Function|undefined): void;

    removeWhere(filter: Function): void;

    remove(value: any, strict: boolean): void;

    except(...indexes: number[]): any[];

    removeAt: (key: number) => void;
    contains: (token: any) => boolean;
    padStart: (length: number, pad: any) => any[];
    padEnd:  (length: number, pad: any) => any[];
    lead: (indexed: boolean) => any[];
    all: (condition: Function) => boolean;
    any: (condition: Function) => boolean;
    logic: (truth: string, condition: Function) => boolean;
    cluster: (callback: Function, store: {}, preserve: boolean) => {};
    chunk: (interval: number) => any[][];
    foreach: (callback: Function) => void;
    annotate: () => any[];
    min: () => number;
    max: () => number;
    normalise: (to: number) => any[];
    isEmpty: () => boolean;
    forEachAsync: (callbackfn: Function, thisArg: any|undefined) => Promise<any>;
    negate(array: any[]): any[];
    similar(array: any[]): any[];

    includesAll(...searchElements: any[]): boolean;
    includesAny(...searchElements: any[]): boolean;

}

declare interface ArrayConstructor {
    range(start: number, end: number): number[];

    always(value: any): any[];
    fromObject(obj: {}): any[];
}

if(!Array.fromObject) {
    Array.fromObject = function(obj: {}): any[] {
        const arr: any[] = [];

        Object.forEach(obj, (v: string, k: number) => {
            arr[k] = v;
        });

        return arr;
    };
}

if(!Array.prototype.except) {
    Array.prototype.except = function(...indexes: number[]): any[] {
        return this.filter((v, i) => !indexes.includes(i));
    };
}

if(!Array.prototype.includesAny) {
    Array.prototype.includesAny = function(...searchElements: any[]): boolean {
        return searchElements.any((e: any) => this.includes(e));
    };
}

if(!Array.prototype.includesAll) {
    Array.prototype.includesAll = function(...searchElements: any[]): boolean {
        return searchElements.all((e: any) => this.includes(e));
    };
}

if(!Array.always) {
    Array.always = function(value: any): any[] {
        return !Object.isArray(value) ? [value] : value;
    };
}

if(!Array.prototype.remove) {
    Array.prototype.remove = function(value: any, strict: boolean = false): void {
        let index;

        while((index = this.findIndex(x => (strict ? (x === value) : (x == value)))) !== -1) {
            this.removeAt(index);
        };
    };
}

if(!Array.prototype.removeFirst) {
    Array.prototype.removeFirst = function(filter: Function|undefined) {
        let key = this.firstKey(filter);

        if(key !== undefined) this.removeAt(key);
    };
}

if(!Array.prototype.removeLast) {
    Array.prototype.removeLast = function(filter: Function|undefined) {
        let key = this.lastKey(filter);

        if(key !== undefined) this.removeAt(key);
    };
}

if(!Array.prototype.similar) {
    Array.prototype.similar = function(array: any[]): any[] {
        let buffer: any[] = [];

        array.forEach((value: any): any => this.includes(value) && buffer.push(value))

        return buffer;
    };
}

if(!Array.prototype.negate) {
    Array.prototype.negate = function(array: any[]): any[] {
        let buffer: any[] = [];

        array.forEach(
            (function(value: any) {
                if(!this.includes(value)) {
                    buffer.push(value);
                }
            }).bind(this)
        )

        return buffer;
    };
}

if(!Array.prototype.forEachAsync) {
    Array.prototype.forEachAsync = function(callbackfn: Function, thisArg: any|undefined = undefined): Promise<any> {
        if(thisArg)
            callbackfn = callbackfn.bind(thisArg);

        return (Promise.all(
            this.map((value, index) => Promise.normalise(callbackfn(value, index)))
        ));
    };
}

// if(!Array.prototype.__filter) {
//     Array.prototype.__filter = Array.prototype.filter;

//     Array.prototype.filter = function(callbackfn: ((value: any, index: number, array: any[]) => unknown)|undefined = undefined, thisArg: any|undefined = undefined) {
//         if(callbackfn === undefined)
//             callbackfn = (value: any) => value !== undefined;
    
//         return this.__filter(callbackfn, thisArg);
//     };
// }

if(!Array.range) {
    Array.range = function(start: number, end: number): number[] {
        if(end == undefined) {
            end = start;
            start = 0;
        }

        for(var arr: number[] = [];start < end; start++)
            arr.push(start);

        return arr;
    };
}

if(!Array.prototype.toggle) {
    Array.prototype.toggle = function(value: any): void {
        let position = this.indexOf(value);

        position == -1 ? this.push(value) : this.removeAt(position);
    };
}

if(!Array.prototype.unique) {
    Array.prototype.unique = function(): any[] {
        let buffer = [];

        for(let index = 0; index < this.length; index++) {
            let value = this[index];

            if(this.indexOf(value) === index) buffer.push(value);
        }

        return buffer;
    };
}

if(!Array.prototype.mean) {
    Array.prototype.mean = function(): number {
        var t = 0;
        var l = this.length;

        for(var i = 0; i < l; i++) {
            t += this[i];
        }

        return t / l;
    };
}

if(!Array.prototype.firstEntry) {
    Array.prototype.firstEntry = function(filter: Function|undefined|undefined): undefined|any[] {
        if(filter) {
            for(let index = 0; index < this.length; index++) {
                if(filter(this[index]))
                    return [index, this[index]];
            }
        }
        else if(this.length > 0) {
            return [0, this[0]];
        }
    };
}


if(!Array.prototype.firstKey) {
    Array.prototype.firstKey = function(filter: Function|undefined|undefined): string|number {
        let firstEntry =  this.firstEntry(filter);

        return firstEntry ? firstEntry[0] : undefined;
    };
}

if(!Array.prototype.first) {
    Array.prototype.first = function(filter: Function|undefined|undefined): any {
        let firstEntry =  this.firstEntry(filter);

        return firstEntry ? firstEntry[1] : undefined;
    };
}

if(!Array.prototype.lastEntry) {
    Array.prototype.lastEntry = function(filter: Function|undefined|undefined): undefined|any[] {
        let last = undefined;

        if(filter) {
            for(let index = 0; index < this.length; index++) {
                if(filter(this[index]))
                    last = [index, this[index]];
            }
        }
        else {
            last = [this.length-1, this[this.length-1]];
        }

        return last;
    };
}

if(!Array.prototype.lastKey) {
    Array.prototype.lastKey = function(filter: Function|undefined|undefined): string|number {
        return (this.lastEntry(filter) || [undefined, undefined])[0];
    };
}

if(!Array.prototype.last) {
    Array.prototype.last = function(filter: Function|undefined|undefined): any {
        return (this.lastEntry(filter) || [undefined, undefined])[1];
    };
}

if(!Array.prototype.removeAt) {
    Array.prototype.removeAt = function(key: number): void {
        this.splice(key, 1);
    };
}

if(!Array.prototype.contains) {
    Array.prototype.contains = function(token: any): boolean {
        return this.includes(token);
    };
}

if(!Array.prototype.padStart) {
    Array.prototype.padStart = function(length: number, pad: any): any[] {
        return (length > -1) ? (Array(length - this.length).fill(pad).concat(this)) : this;
    };
}

if(!Array.prototype.padEnd) {
    Array.prototype.padEnd = function (length: number, pad: any): any[] {
        return (length > -1) ? this.concat(Array(length - this.length).fill(pad)) : this;
    };
}

if(!Array.prototype.lead) {
    Array.prototype.lead = function(indexed: boolean): any[] {
        let groups = [];

        let lastIndex = 0;

        for(let currentIndex = 1; currentIndex < this.length; currentIndex++) {
            if(indexed) {
                groups.push([[lastIndex, this[lastIndex]], [currentIndex, this[currentIndex]]]);
            }
            else {
                groups.push([this[lastIndex], this[currentIndex]]);
            }


            lastIndex = currentIndex;
        }

        return groups;
    };
}

if(!Array.prototype.all) {
    Array.prototype.all = function(condition: Function): boolean {
        return this.logic("and", condition);
    };
}

if(!Array.prototype.any) {
    Array.prototype.any = function(condition: Function): boolean {
        return this.logic("or", condition);
    };
}

if(!Array.prototype.logic) {
    Array.prototype.logic = function(truth: string, condition: Function): boolean {
        
        if(Object.isString(truth)) {
            truth = truth.toLowerCase();
            let branch: Function;
            let end = false;
            
            if(Object.isFunction(condition)) {
                switch(truth) {
                    case "or":
                        branch = (outcome: boolean): boolean|undefined => (outcome || undefined);
                        end = false;
                        break;
                    case "and":
                        branch = (outcome: boolean): boolean|undefined => (outcome === false) ? false : undefined;
                        end = true;
                        break;
                    default:
                        throw new Error();
                        break;
                }

                for(let index = 0; index < this.length; index++) {
                    let item = this[index];
                    let outcome = condition(item);
                    let todo = branch(outcome);

                    if(todo !== undefined) {
                        return todo;
                    }
                }

                return end;
            }
            else {
                throw new TypeError("Callback function passed to Array.logic is a function.");
            }
        }
        else {
            throw new TypeError("Truth function passed to Array.logic is not of type string.");
        }

        return false;
    };
}

if(!Array.prototype.cluster) {
    Array.prototype.cluster = function(callback: Function, store: Object = {}, preserve: boolean = false): {} {
        if(!callback)
            return this;

        var clusters: {[key: string|number]: any} = store;

        this.forEach((value, key) => {
            let cluster: string|number = callback(value, key);

            if(!clusters.hasOwnProperty(cluster))
                clusters[cluster] = [];

            if(preserve) clusters[cluster][key] = value;
            else clusters[cluster].push(value);
        });

        return clusters;
    };
}

if(!Array.prototype.chunk) {
    Array.prototype.chunk = function(interval: number): any[][] {
        let chunks = [];

        for(let index = 0; index < this.length; index++) {
            if(index % interval === 0) {
                chunks.push(this.slice(index, index+interval));
            }
        }

        return chunks;
    }
}

if(!Array.prototype.foreach) {
    Array.prototype.foreach = function(callback: Function): void {
        for(let index = 0; index < this.length; index++)    
            if(callback(this[index], index, this) != undefined)
                break;
    };
}

if(!Array.prototype.annotate) {
    Array.prototype.annotate = function(): any[] {
        return this.map((value, index) => {
            const first = index === 0;
            const last  = index === this.length - 1;

            return {
                value,
                pos: first ? -1 : (last ? 1 : 0),
                only: first && last
            }
        });
    }
}

if(!Array.prototype.min) {
    Array.prototype.min = function(): number {
        return Math.min(...this);
    };
}

if(!Array.prototype.max) {
    Array.prototype.max = function(): number {
        return Math.max(...this);
    };
}

if(!Array.prototype.normalise) {
    Array.prototype.normalise = function(to: number): any[] {
        let minimum: number = this.min();
        let maximum: number = this.max();
        let range: number= (maximum - minimum);

        let callback = (number: number) => (number - minimum) / range;

        if(to != undefined) callback = (number) => number / to;

        return (!isNaN(minimum) && !isNaN(maximum) && !isNaN(range)) ? this.map(callback) : [];
    };
}

if(!Array.prototype.isEmpty) {
    Array.prototype.isEmpty = function(): boolean {
        return this.length === 0;
    };
}
