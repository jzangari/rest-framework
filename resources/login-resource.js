var authenticationService = require('./../services/authentication-service');
var error = require('../rest-api/error');

function LoginResource(){
    this.resourceName = LoginResource.resourceName;
    this.save = authenticationService.authenticate;
    this.getById = authenticationService.getToken;
    this.getAll =  function(successCallback, errorCallback){
        errorCallback(new Error(401, 'Unauthorized'));
    };
    this.update = function(id, object, successCallback, errorCallback){
        errorCallback(new Error(401, 'Unauthorized'));
    }
    this.delete = function(id, successCallback, errorCallback){
        errorCallback(new Error(401, 'Unauthorized'));
    }
};

LoginResource.resourceName = 'login';
module.exports = LoginResource;
