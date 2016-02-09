var authenticationService = require('./../services/authentication-service')

function LoginResource(){
    this.resourceName = LoginResource.resourceName;
    this.save = authenticationService.authenticate;
    this.getById = authenticationService.getToken;
    //Don't return all the tokens, and you need both for a get.
    this.getAll = function(){[]};
}

LoginResource.resourceName = 'login'
module.exports = LoginResource;
