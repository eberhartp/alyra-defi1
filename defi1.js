//Fonction qui normalise une chaîne héxadécimale en minuscule et sans le 0x
function _normHexaString(hexaString) {
    let normString = hexaString.toLowerCase();
    if (normString.startsWith("0x"))
        normString = normString.slice(2);

    return normString;
}

//Fonction qui converti un hexadécimal -> décimal
function convertHexaToDeci(string) {
    
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
        return number.toString(16);
    
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
