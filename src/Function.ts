/** Declaration merge */
declare interface Function {
    chain(
        funcs: Function[],
        initials: any[],
        fallback: Function|undefined,
        async?: boolean,
        escape?: boolean
    ): Promise<any>|any;

    truthy(): Test
    falsy(): Test
}

declare type Test = (v: any) => boolean;

if(!Function.truthy) {
    Function.truthy = function(): Test {
        return ((v: any) => v == true);
    };
}

if(!Function.falsy) {
    Function.falsy = function(): Test {
        return ((v: any) => v == false);
    };
}

if(!Function.chain) {
    Function.chain = function(
        funcs: Function[],
        initials: any[] = [],
        fallback: Function|undefined = undefined,
        async: boolean = false,
        escape: boolean = false
    ): Promise<any>|any {
        if(!funcs.isEmpty()) {
            const wrappers: Function[] = [];

            const callables: Function[] = funcs.map((func) => {
                const wrapper: Function = function(...fargs: any[]): Promise<any>|any {
                    const args: any[] = [...fargs];

                    let next: Function|undefined = undefined;
                    let escape: Function|undefined = undefined;

                    if(this.next === undefined && this.escape !== undefined) {
                        escape = this.escape;
                    }
                    else {
                        next = this.next || ((result: any): any => result);
                    }

                    args.push(next);
                    args.push(escape);

                    const result: any = this.current(...args);
                    
                    return async ? Promise.normalise(async) : async;
                };
                wrapper.bind(wrapper);
                
                wrapper.current = func;
                
                wrapper.fallback = escape ? fallback : undefined;

                return wrapper;
            });

            callables.push(!escape ? fallback : undefined);

            callables.lead().forEach(([lastWrapper, nextWrapper]): void => {
                lastWrapper.next = nextWrapper && nextWrapper.bind(nextWrapper);

                wrappers.push(lastWrapper);
            });

            let result: any = wrappers[0].call(wrappers[0], ...initials);

            return async ? Promise.normalise(result) : result;
        }

        if(fallback)
            fallback = fallback(initials);

        return fallback ? (async ? Promise.normalise(fallback) : fallback) : undefined;
    };
}