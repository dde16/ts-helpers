/** Declaration Merge */
declare interface Window {
    events: {
        [key: string]: Function[]
    };
    on(key: string, callback: Function): void;
    image(path: string, axis: string): Object;
}

Window.prototype.image = function(path: string, axis: string = "b"): Object {
    const image = new Image();

    image.loading = "lazy";
    image.src = path;

    image.axis = axis;

    return image;
};


Window.prototype.events = {};

window.on = (function(key: string, callback: Function) {
    if(!this.events.hasOwnProperty(key))
        this.events[key] = [];

    this.events[key].push(callback);
});

Object.forEach(
    window,
    function(value: any, key: string) {
        if(key.startsWith("on") && !value) {
            window[key] = async function() {
                let funcs: Function[] = this.events[key.substr(2)]||[];

                if(!(funcs).isEmpty()) {
                    return (await Function.chain(
                        funcs,
                        [...arguments],
                        () => true,
                        true
                    ));
                }
            };
        }
    }
);