var authenticationService = require('../services/authentication-service');
var responseBuilder = require('../rest-api/response-builder');
var Error = require('../rest-api/error');

module.exports.filter = function filter(clientRequest, serverResponse, next) {
    var url = clientRequest.url.toLowerCase();
    if (clientRequest.url.toLowerCase() == '/login' && clientRequest.method == 'POST') {
        console.log('Login Request');
        return next();
    } else if(url.indexOf('/logout') === 0 && clientRequest.method == 'PUT'){
        console.log('Logout Request');
        return next();
    }else {
        var token = clientRequest.headers['authorization'];
        if(token != undefined){
            authenticationService.authorizeToken(token,function(authorized){
                if(!authorized){
                    console.log('Authorization failed for: ' + token);
                    responseBuilder.writeErrorResponse(serverResponse, new Error(401, "Unauthorized"));
                } else {
                    return next();
                }
            });

        } else {
            console.log('Request unauthorized');
            responseBuilder.writeErrorResponse(serverResponse, new Error(401, "Unauthorized"));
        }
    }
};