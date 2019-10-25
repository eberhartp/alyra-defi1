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
    let prefix = varInt.substring(0,2)
    let tempDeci = ""
    let width = 0
    if (prefix == "fd") {
        tempDeci = varInt.substring(2)
        width = 4
    } else if (prefix == "fe") {
        tempDeci = varInt.substring(2)
        width = 8
    } else if (prefix == "ff") {
        tempDeci = varInt.substring(2)
        width = 16
    } else {
        tempDeci = varInt
        width = 2
    }
    //controling input size
    if (tempDeci.length != width) {
        return "Please insert a varInt"
    } else {
        deci = parseInt(varInt, 16).toString()
        return deci
    }
}

//Fonction qui converti un varInt -> décimal
function convertBitsToTarget(number) {

}

//Fonction qui converti un varInt -> décimal
function convertTargetToDifficulty(number) {

}
