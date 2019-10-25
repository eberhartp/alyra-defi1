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
function convertVarIntToDeci(string) {
    let normString = _normHexaString(string);
    let prefix = parseInt(normString.slice(0,2), 16);
    let numberString = normString.slice(2);

    if (prefix < 0xfd)
        return prefix;
    
    if ((prefix == 0xfd && numberString.length != 4) ||
        (prefix == 0xfe && numberString.length != 8) ||
        (prefix == 0xff && numberString.length != 16))
        return "Format de base non valide";

    return parseInt(convertHexaLittleEndianToHexa(numberString), 16);
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
