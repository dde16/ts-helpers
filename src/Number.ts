declare interface Number {
    nearest(rung: number): number;
    enclose(lookahead: number, max: number): number;
    swing(min: number, max: number): number;
    overflow(min: number, max: number): number;
    factorial(): number;
    withinBounds(min: number, max: number, opt: number): boolean;
    nearest(to: number): number;
    swing(min: number, max: number): number;
    ceil(): number;
    round(rounder: number): number;
    getDecimalDigits(): number;
    isPrintableCharCode(): boolean;
    isNumberCharCode(): boolean;
    unpack(values: number[]): number[];
}

declare interface NumberConstructor {
    parse(number: any, datatype: string): number;
    isFloat(n: number): boolean;
    parsable(number: any): boolean;
    parsableFloat(number: any): boolean;
    parsableInt(number: any) : boolean;
}



Number.prototype.unpack = function(values: number[]): number[] {
    var num: number = this.valueOf();
    return values.filter((filter) => num & filter);
};

Number.prototype.nearest = function(rung: number): number {
    let number    = this.valueOf();
    let median    = rung/2;
    let remainder = number % rung;

    return (remainder >= median) ? (number + (rung - remainder)) : (number - remainder);
};

Number.prototype.enclose = function(lookahead: number, max: number): number {
    let number = this.valueOf();

    // if((lookahead * 2) >= max)
    // return Array.range(0, (lookahead*2)+1);

    let lowerBound = number - lookahead;

    if(number < lookahead) {
        lowerBound += lookahead;
        lookahead *= 2;

        if((lowerBound-1) > -1) {
            
            lowerBound -= 1;
            lookahead -= 1;
        }

    }

    let upperBound = (number + lookahead) + 1;

    if(upperBound > max) {
        upperBound = max;
        // let overflow = max % upperBound;

        // upperBound -= overflow;
        // lowerBound -= overflow;
    }

    return Array.range(lowerBound, upperBound);
};

Number.prototype.swing = function(min: number, max: number): number {
    let num: number = this.valueOf();
    let median = (min + max) / 2;

    if((num >= median) && (num <= max))
        return max;
    else if((num < median) && (num > min))
        return min;

    return num;
};


Number.prototype.overflow = function(min: number, max: number): number {
    let num: number = this.valueOf();

    if(num > max) {
        num = min + (num % max);
    }
    else if(num < min) {
        if(num > 0) {
            num = (max - (min - num));
        }
        else {
            num = ((num - min) * -1) % max;
        }
    }

    return num;
};

Number.prototype.factorial = function(): number {
    let num: number = this.valueOf();
    var j = 1;

    for(var i = num; i > 0; i--)
        j = j * i;

    return j;
};

Number.prototype.withinBounds = function(min: number, max: number, opt: number = 1): boolean {
    switch(opt) {
        case 0:
            return ((this > min) && (this < max));
            break;
        case 1:
            return ((this >= min) && (this <= max));
            break;
    }

    return false;
};

Number.prototype.ceil = function(): number {
    return Math.ceil(this.valueOf());
};

Number.prototype.round = function(rounder: number): number {
    let value = this.valueOf();

    if(rounder) {
        let rounderDecimalPow    = 10 ** (rounder.getDecimalDigits() - 1);
        let numberDecimal        = (value * rounderDecimalPow) % 1;
        let numberLowered        = value - numberDecimal;

        return numberLowered + ((numberDecimal >= rounder) ? (1 / rounderDecimalPow) : 0);  
    }
    else {
        return Math.round(value);
    }
};

Number.prototype.getDecimalDigits = function(): number {
    let number = this.valueOf();

    let count = 0;

    while(number < 1) {
        number *= 10;
        count++;
    }

    return count;
};

Number.prototype.isPrintableCharCode = function(): boolean {
    let keycode = this;

    return (keycode > 47 && keycode < 58)   || // number keys
           keycode == 32 || keycode == 13   || // spacebar & return key(s) (if you want to allow carriage returns)
           (keycode > 64 && keycode < 91)   || // letter keys
           (keycode > 95 && keycode < 112)  || // numpad keys
           (keycode > 185 && keycode < 193) || // ;=,-./` (in order)
           (keycode > 218 && keycode < 223);
};

Number.prototype.isNumberCharCode = function(): boolean {
    let keycode = this;

    return (keycode > 47 && keycode < 58);
};

Number.parse = function(number: any, datatype: string): number {
    if(Object.isNumber(number)) return number;

    let parser: Function = parseInt;
    let type: string     = datatype.toLowerCase();

    if(type === "int" || type === "int32" || type === "integer") {
        parser = parseInt;
    }
    else if(type === "float" || type === "double" || type === "decimal") {
        parser = parseFloat;
    }

    return parser(number);
};


Number.isFloat = function(n: number): boolean {
    return Number(n) === n && n % 1 !== 0;
};


Number.parsable = function(number: any): boolean {
    return Number.parsableFloat(number) || Number.parsableInt(number);
};


Number.parsableFloat = function(number: any): boolean {
    if(Object.isSet(number)) {
        if(Object.isNumber(number)) {
            return Number.isFloat(number);
        }
    }
    else {
        return false;
    }

    if(Object.isString(number)) {
        return Object.isSet(number.match(/^[0-9]+(\.[0-9]+)?$/));
    }

    return false;
};

Number.parsableInt = function(number: any) : boolean {
    if(Object.isSet(number)) {
        if(Object.isNumber(number)) {
            return Number.isFloat(number);
        }
    }
    else {
        return false;
    }

    if(Object.isString(number)) {
        return Object.isSet(number.match(/^[0-9]+$/));
    }

    return false;
};