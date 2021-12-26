declare interface PromiseConstructor {
    normalise(value: any): Promise<any>;
}

Promise.normalise = function(value: any): Promise<any> {
    let promise = value;

    if(!(promise instanceof Promise)) {
        promise = new Promise((resolve, reject) => resolve(value));
    }

    return promise;
};