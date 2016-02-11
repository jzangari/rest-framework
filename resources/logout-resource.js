var authenticationService = require('./../services/authentication-service');
var error = require('../rest-api/error');
var mongoDataAccess = require('./../data/mongo-data-access');

function LogoutResource(){
    this.resourceName = LogoutResource.resourceName;

    //Update takes the form of PUTing {"logout":true} to the /logout/<token>
    this.update = function(token, object, successCallback, errorCallback){
        authenticationService.invalidateAuthorization(token, successCallback, errorCallback);
    };

    this.save = function(object, successCallback, errorCallback){
        errorCallback(new Error(401, 'Unauthorized'));
    };
    this.getById =function(id, successCallback, errorCallback) {
        errorCallback(new Error(401, 'Unauthorized'));
    };
    this.getAll =  function(successCallback, errorCallback){
        errorCallback(new Error(401, 'Unauthorized'));
    };
    this.delete = function(id, successCallback, errorCallback){
        errorCallback(new Error(401, 'Unauthorized'));
    };
};

LogoutResource.resourceName = 'logout';
module.exports = LogoutResource;