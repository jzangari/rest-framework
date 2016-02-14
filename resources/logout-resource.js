var authenticationService = require('./../services/authentication-service');
var error = require('../rest-api/error');
var mongoDataAccess = require('./../data/mongo-data-access');

var configurationSchema = {
    "id": "/LoginAttempt",
    "type": "object",
    "properties": {
        "logout": {"type":"boolean"},
        "required": []
    }
};

LogoutResource.inputSchema =  configurationSchema;

function LogoutResource(){
    this.inputSchema = LogoutResource.inputSchema;
    this.resourceName = LogoutResource.resourceName;

    //Update takes the form of PUTing {"logout":true} to the /logout/<token>
    this.put = function(token, object, callback){
        authenticationService.invalidateAuthorization(token, callback);
    };

    this.post = function(object, callback){
        callback(new Error(401, 'Unauthorized'));
    };
    this.getById =function(id, callback) {
        callback(new Error(401, 'Unauthorized'));
    };
    this.getAll =  function(callback){
        callback(new Error(401, 'Unauthorized'));
    };
    this.delete = function(id, callback){
        callback(new Error(401, 'Unauthorized'));
    };
};

LogoutResource.resourceName = 'logout';
module.exports = LogoutResource;