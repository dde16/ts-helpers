/** Declaration merge */
declare interface FileReader {
    readAsArrayBufferAsync(blob: Blob): Promise<ArrayBuffer>;
}

FileReader.prototype.readAsArrayBufferAsync = function(blob: Blob): Promise<ArrayBuffer> {
    return new Promise(
        (function(resolve: Function, reject: Function) {
            var _onload = this.onload;

            this.onload = function(event: Event) {
                if(_onload) _onload(event);

                resolve(this.result);
            };

            this.onerror = function(error: Error) {
                reject(error);
            };
        
            this.readAsArrayBuffer(blob);
        }).bind(this)
    );

};