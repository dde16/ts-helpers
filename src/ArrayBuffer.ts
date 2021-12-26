declare type AlgorithmParams = RsaOaepParams|AesCtrParams|AesCbcParams|AesGcmParams;

/** Declaration merge */
declare interface ArrayBuffer {
    encrypt(algorithm: AlgorithmIdentifier|AlgorithmParams, key: CryptoKey|string): Promise<ArrayBuffer>;
    decrypt(algorithm: AlgorithmIdentifier|AlgorithmParams, key: CryptoKey|string): Promise<ArrayBuffer>;
}

ArrayBuffer.prototype.encrypt = async function(algorithm: AlgorithmIdentifier|AlgorithmParams, key: CryptoKey): Promise<ArrayBuffer> {
    let buffer = await crypto.subtle.encrypt(algorithm, key, this);

    return buffer;
};

ArrayBuffer.prototype.decrypt = async function(algorithm: AlgorithmIdentifier|AlgorithmParams, key: CryptoKey): Promise<ArrayBuffer> {
    let buffer = await crypto.subtle.decrypt(algorithm, key, this);

    return buffer;
};