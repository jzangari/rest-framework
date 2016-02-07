module.exports.filter = function filter(httpRequest, httpResponse) {
    if (httpRequest.url.toLowerCase() == '/authenticate') {
        console.log('Authentication Request');
        return;
    } else {
        var token = httpRequest.headers['auth-token'];
        if(token != undefined){
            console.log('Authorizing request to: ' + httpRequest.url + ' having token: ' + token);
            //TODO Validate token with database.
        } else {
            //TODO Return unauthorized response.
        }
    }
};