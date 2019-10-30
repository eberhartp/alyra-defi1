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

// let parser = new BitcoinHexaParser(string);
// let blockObject = parser.parseBlock();