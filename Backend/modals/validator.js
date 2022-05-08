const validator = require('validator');

exports.validator_isEmpty = function(data) {
    if(data === undefined || data === null){
        return true;
    } else if(validator.isEmpty(data)){
        return true;
    } else {
        return false;
    }
}

exports.validator_isFloat = function(n){
    return /[\.]/.test(String(n));
}

exports.validator_isDate = function(d) {
    return (new Date(d) !== "Invalid Date") && !isNaN(new Date(d));
}