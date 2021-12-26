declare interface FormData {
    fromObject(obj: Entries): void;
}

//@ts-ignore
FormData.fromObject = function(obj: Entries): FormData {
    let formData = new FormData;
    formData.fromObject(obj);

    return formData;
};

FormData.prototype.fromObject = function (obj: Entries): void {
    Object.forEach(
        obj,
        (function(value: any, key: string): void {
            this.set(key, value);
        }).bind(this)
    );
};