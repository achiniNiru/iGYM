exports.defaultResponse = function(res, status, success, msg) {
    let response = {}
    if(status === 200){
        response = {
            success: success,
            result: msg
        }
    } else {
        response = {
            success: success,
            error: msg
        }
    }
    res.status(status).send(response);
}