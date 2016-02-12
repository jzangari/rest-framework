var authenticationService = require('../services/authentication-service');
var responseBuilder = require('../rest-api/response-builder');
var Error = require('../rest-api/error');

module.exports.filter = function(clientRequest, serverResponse, next) {
    //Pass through Login and Logout requests based on URL and HTTP Method.
    var url = clientRequest.url.toLowerCase();
    if (clientRequest.url.toLowerCase() == '/login' && clientRequest.method == 'POST') {
        console.log('Login Request');
        return next();
    } else if(url.indexOf('/logout') === 0 && clientRequest.method == 'PUT'){
        console.log('Logout Request');
        return next();
    }else {
        console.log('Authorizing request.');
        //Get the token from the header and test it.
        var token = clientRequest.headers['authorization'];
        if(token != undefined){
            //Lets do some token validating.
            authenticationService.authorizeToken(token, function(authorized){
                    //Send error if the token wasn't valid.
                    if(!authorized){
                        console.log('Authorization failed for: ' + token);
                        responseBuilder.writeErrorResponse(serverResponse, new Error(401, "Unauthorized"));
                    //Otherwise, next piece in the chain!
                    } else {
                        return next();
                    }
                }
            );
        //No token, no access.
        } else {
            console.log('Request unauthorized');
            responseBuilder.writeErrorResponse(serverResponse, new Error(401, "Unauthorized"));
        }
    }
};