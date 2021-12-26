/** Declaration merge */
declare interface Crypto {
    getRandomBytes(length: Number): string;
}

Crypto.prototype.getRandomBytes =
    function(length: number) {
        return (new TextDecoder()).decode(crypto.getRandomValues((new Uint8Array(length))));
    };