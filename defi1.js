//Fonction qui normalise une chaîne héxadécimale en minuscule et sans le 0x
function _normHexaString(hexaString) {
    let normString = hexaString.toLowerCase();
    if (normString.startsWith("0x"))
        normString = normString.slice(2);

    return normString;
}

//Fonction qui converti un hexadécimal -> décimal
function convertHexaToDeci(hexa) {
    let decimal = parseInt(hexa, 16);
    return decimal
}

//Fonction qui converti un décimal -> hexadécimal
function convertDeciToHexa(number){
    let hexString = parseInt(number, 10).toString(16);
    if (hexString.length % 2 == 1)
        hexString = "0" + hexString;
    return "0x" + hexString;
}

//Fonction qui converti un hexadécimal little endian -> hexadécimal
function convertHexaLittleEndianToHexa(string) {
    let hexString = _normHexaString(string);
    if (hexString.length % 2 == 1)
        hexString = "0" + hexString;
    return "0x" + hexString.match(/.{1,2}/g).reverse().join("");
}

//Fonction qui converti un varInt -> décimal
function convertVarIntToDeci(varInt) {
    let prefix = varInt.substring(0,4)
    let tempDeci = ""
    let width = 0
    if (prefix == "0xfd") {
        tempDeci = varInt.substring(4)
        width = 4
    } else if (prefix == "0xfe") {
        tempDeci = varInt.substring(4)
        width = 8
    } else if (prefix == "0xff") {
        tempDeci = varInt.substring(4)
        width = 16
    } else {
        tempDeci = varInt.substring(2)
        width = 2
    }
    //controling input size
    if (tempDeci.length != width || varInt.substring(0,2) != "0x") {
        return "Please insert a varInt"
    } else {
        deci = convertHexaLittleEndianToHexa(tempDeci)
        deci = parseInt(deci, 16).toString()
        return deci
    }
}

//Fonction qui converti un décimal -> varInt
function convertDeciToVarInt(number) {
    if (number < 0xfd)
        return convertDeciToHexa(number);
    
    let prefix;
    let hexaString = convertDeciToHexa(number);
    hexaString = _normHexaString(hexaString);

    if (number < 0x10000) {
        hexaString = hexaString.padStart(4, "0");
        prefix = "fd";
    } else if (number < 0x100000000) {
        hexaString = hexaString.padStart(8, "0");
        prefix = "fe";
    } else {
        hexaString = hexaString.padStart(16, "0");
        prefix = "ff";
    }
    return "0x" + prefix + _normHexaString(convertHexaLittleEndianToHexa(hexaString));
}

//Fonction qui converti un champ Bits -> cible
function convertBitsToTarget(string) {
    let normString = _normHexaString(string);
    let exponent = parseInt(normString.slice(0,2), 16);
    let significand = normString.slice(2);

    return "0x" + significand.padEnd(2 * exponent, "0").padStart(64, "0");
}

//Fonction qui converti une cible -> difficulté
function convertTargetToDifficulty(string) {
    let normString = _normHexaString(string);
    let currentTarget = parseInt(normString, 16);
    let maxTarget = parseInt("0x00000000FFFF0000000000000000000000000000000000000000000000000000");

    return maxTarget / currentTarget;
}

//Fonction qui converti une cible -> difficulté (pool)
function convertTargetToPDifficulty(string) {
    let normString = _normHexaString(string);
    let currentTarget = parseInt(normString, 16);
    let maxTarget = parseInt("0x00000000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF");

    return maxTarget / currentTarget;
}

class BitcoinHexaParser {
    constructor(hexaString) {
        this.content = hexaString;
    }

    _parseIntLE() {
        // Parse next 4 bytes as unsigned int32 in little endian
        let intStringLE = this.content.substring(0, 8).match(/.{2}/g).reverse().join("");
        this.content = this.content.slice(8);
        return parseInt(intStringLE, 16);
    }

    _parseLongLE() {
        // Parse next 8 bytes as unsigned int64 in little endian
        let intLongLE = this.content.substring(0, 16).match(/.{2}/g).reverse().join("");
        this.content = this.content.slice(16);
        return parseInt(intLongLE, 16);
    }

    _parseHashLE() {
        // Parse next 32 bytes as a SHA256 hash in little endian
        let hashStringLE = this.content.substring(0, 64).match(/.{2}/g).reverse().join("");
        this.content = this.content.slice(64);
        return hashStringLE;
    }

    _parseVarInt() {
        // Parse a varInt (variable size)
        let varIntPrefix = parseInt(this.content.substring(0, 2), 16);
        this.content = this.content.slice(2);
        if (varIntPrefix < 0xFD)
            return varIntPrefix;
        let varIntLength;
        switch (varIntPrefix) {
            case 0xFD:
                varIntLength = 4;
                break;
            case 0xFE:
                varIntLength = 8;
                break;
            case 0xFD:
                varIntLength = 16;
                break;
        }
        let varIntString = this.content.substring(0, varIntLength);
        this.content = this.content.slice(varIntLength);
        return parseInt(varIntString, 16);
    }

    _parseBlockHeader() {
        // Parse a block header
        let blockHeaderObject = {};
        blockHeaderObject.version = this._parseIntLE();
        blockHeaderObject.previousblockhash = this._parseHashLE();
        blockHeaderObject.merkleroot = this._parseHashLE();
        blockHeaderObject.time = this._parseIntLE();
        blockHeaderObject.bits = this._parseIntLE();
        blockHeaderObject.nonce = this._parseIntLE();
        return blockHeaderObject;        
    }

    _parseTxVin() {
        // Parse a transaction input entry
        let txVinObject = {};
        txVinObject.txid = this._parseHashLE();
        txVinObject.vout = this._parseIntLE();
        let scriptSigSize = this._parseVarInt();
        txVinObject.scriptSig = { hex : this.content.substring(0, scriptSigSize * 2) };
        this.content = this.content.slice(scriptSigSize * 2);
        txVinObject.sequence = this._parseIntLE();
        return txVinObject;
    }

    _parseTxVout() {
        // Parse a transaction output entry
        let txVoutObject = {};
        txVoutObject.value = this._parseLongLE();
        let scriptPubKeySize = this._parseVarInt();
        txVoutObject.scriptPubKey = { hex :  this.content.substring(0, scriptPubKeySize * 2) };
        this.content = this.content.slice(scriptPubKeySize * 2);
        return txVoutObject;
    }

    _parseTx() {
        // Parse a transaction
        let txObject = {};
        txObject.version = this._parseIntLE();

        txObject.vin = [];
        let vinCount = this._parseVarInt();
        for (let i = 0; i < vinCount; i++) {
            txObject.vin.push(this._parseTxVin());
        }

        txObject.vout = [];
        let voutCount = this._parseVarInt();
        for (let i = 0; i < voutCount; i++) {
            txObject.vout.push(this._parseTxVout());
        }

        txObject.locktime = this._parseIntLE();

        return txObject;
    }

    parseBlock() {
        let blockObject = {};

        let blockHeaderObject = this._parseBlockHeader();
        for (const key in blockHeaderObject) {
            blockObject[key] = blockHeaderObject[key];
        }

        blockObject.tx = [];
        let txCount = this._parseVarInt();
        for (let i = 0; i < txCount; i++) {
            blockObject.tx.push(this._parseTx());
        }

        return blockObject;
    }
}
