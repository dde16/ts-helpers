declare interface String {
    __split: Function;

    formatwith(pattern: string, args: any[]): string;
    restformat(...args: any[]): string;
    brackets(...args: any[]): string;
    split(splitter: number|string|RegExp, limit?: number|undefined): string[];
    title(): string;
    snake(): string;
    camel(): string;
    wrap(around: string): string;
    pathNormalise(): string;
    hashCode(): number;
    isEmpty(): boolean;
    contains(needle: string): boolean;
    toArrayBuffer(): ArrayBuffer;
    pluralise(suffix: string, items: number): string|undefined;
    count(substr: string): number;
    escapeRegex(): string;
    multireplace(replacements: StringMap<Scalar>): string;
}

if(!String.prototype.multireplace) {
    String.prototype.multireplace = function(replacements: StringMap<Scalar>): string {
        return this.replace(
            new RegExp("("+Object.keys(replacements).map((s: string): string => s.escapeRegex()).join("|")+")", "g"),
            function(match: string, contents: any): string {
                return (contents ? replacements[contents].toString() : "");
            }
        );
    };
}

if(!String.prototype.escapeRegex) {
    String.prototype.escapeRegex = function() {
        return this.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    };
}

if(!String.prototype.count) {
    String.prototype.count = function(substr: string) {
        return (this.match(new RegExp(substr.escapeRegex(), "g")) || []).length;
    };
}

if(!String.prototype.pluralise) {
    String.prototype.pluralise = function(suffix: string, items: number): string|undefined {
        return (this.valueOf() + (items > 1 || items === 0 ? suffix : ''));
    };
}

if(!String.prototype.toArrayBuffer) {
    String.prototype.toArrayBuffer = function(): ArrayBuffer {
        return (new TextEncoder()).encode(this.toString());
    };
}

if(!String.prototype.matchAll) {
    String.prototype.matchAll = function*(pattern: RegExp) {
        let matches: any[] = [];
        let match = null;

        if(pattern instanceof RegExp) {
            do {
                match = pattern.exec(this.toString());

                if(match)
                    yield match;

            } while(match);
        }

        return matches;
    }
}

if(!String.prototype.camel) {
    String.prototype.camel = function(): string {
        return this.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word: string, index: number): string {
            return index === 0 ? word.toLowerCase() : word.toUpperCase();
        }).replace(/[\s-]+/g, "");
    };
}

if(!String.prototype.formatwith) {
    String.prototype.formatwith = function(pattern: string, args: any[]): string {
        let argumentsCompound = args;
        let argumentsLength   = argumentsCompound.length;

        if (argumentsLength === 1 && (
            
            Object.isArray(argumentsCompound[0]) || Object.isObject(argumentsCompound[0])) && !Object.isString(argumentsCompound[0])) {
            argumentsCompound = argumentsCompound[0];
        }
        else {
            argumentsCompound = Array.from(argumentsCompound);
        }

        let callback: Function;
        
        if (Object.isArray(argumentsCompound)) {
            callback = function (index: number, key: string, source: any[]): any {
                return source[index];
            };
        }
        
        else if(Object.isObject(argumentsCompound)) {
            callback = function (index: number, key: string, source: {}): any {
                return source[key];
            };
        }
        else {
            throw new Error();
        }

        let string = this;
        let regex = new RegExp(pattern, "g");
        
        let matches = Array.from(this.matchAll(regex));

        for(let index = 0; index < matches.length; index++) {
            let match = matches[index];
            let specifier = match[0];
            let key = match[1];
            let value = callback(index, key, argumentsCompound);

            if(value != null) string = string.replace(specifier, value);
        }

        return string.toString();
    };
}

if(!String.prototype.restformat) {
    String.prototype.restformat = function(...args: any[]): string {
        return this.formatwith(":([\\w\\d\\.\\-]+)", args);
    };
}

if(!String.prototype.brackets) {
    String.prototype.brackets = function(...args: any[]): string {
        return this.formatwith("{\\s*([\\w\\d\\.\\-]*)\\s*}", args);
    };
}

if(!String.prototype.__split) {
    String.prototype.__split = String.prototype.split;

    String.prototype.split = function(splitter: number|string|RegExp = 1, limit?: number|undefined): string[] {        
        if(typeof splitter === "number") {
            splitter = splitter.valueOf();

            let parts = [];
        
            for (let index = 0; index < this.length; index++)
                if(index % splitter === 0)
                    parts.push(this.substr(index, splitter));
        
            return parts;
        }
        
        
        return this.__split(splitter, limit);
    };
}

if(!String.prototype.title) {
    String.prototype.title = function(): string {
        return this.replace(/_/g, " ").split(" ").map((str: string) => (str.substr(0, 1).toUpperCase() + str.substr(1))).join(" ");
    }
}

if(!String.prototype.snake) {
    String.prototype.snake = function(): string {
        return this.replace(/(\ +)|(\-+)/g, "_").toLowerCase();
    };
}

if(!String.prototype.wrap) {
    String.prototype.wrap = function(around: string): string {
        return around+this+around;
    };
}

if(!String.prototype.pathNormalise) {
    String.prototype.pathNormalise = function(): string {
        let str = this;

        if(!str.startsWith("/")) {
            str = "/" + str;
        }

        if(str.endsWith("/")) {
            str = str.substring(0, str.length-1);
        }

        return str.toString();
    };
}

if(!String.prototype.hashCode) {
    String.prototype.hashCode = function(): number {
        let hash = 0;

        if (this.length === 0) return hash;

        for (let i = 0; i < this.length; i++) {
            let char = this.charCodeAt(i);
            hash = ((hash<<5)-hash)+char;
            hash = hash & hash; // Convert to 32bit integer

            if(hash < 0)
                hash *= -1;
        }

        return hash;
    };
}

if(!String.prototype.isEmpty) {
    String.prototype.isEmpty = function(): boolean {
        return (this.replace(/ /g, "") === "");
    };
}

if(!String.prototype.contains) {
    String.prototype.contains = function(needle: string): boolean {
        return (this.indexOf(needle) !== -1)
    };
}