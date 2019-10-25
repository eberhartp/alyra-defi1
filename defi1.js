//Fonction qui converti un hexadécimal -> décimal
function convertHexaToDeci(string) {
    
}

//Fonction qui converti un décimal -> hexadécimal
function convertDeciToHexa(number){

}

//Fonction qui converti un hexadécimal little endian -> hexadécimal
function convertHexaLittleEndianToHexa(string) {

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
        deci = parseInt(varInt, 16).toString()
        return deci
    }
}

//Fonction qui converti un Bits -> Cible
function convertBitsToTarget(number) {

}

//Fonction qui converti une Cible -> Difficulté
function convertTargetToDifficulty(number) {

}
