import validator from 'validator';

export function validator_isEmpty(data) {
    if(data === undefined || data === null){
        return true;
    } else if(validator.isEmpty(data)){
        return true;
    } else {
        return false;
    }
}

export function validator_isFloat(n){
    return /[\.]/.test(String(n));
}