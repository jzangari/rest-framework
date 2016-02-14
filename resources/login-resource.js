var authenticationService = require('./../services/authentication-service');
var error = require('../rest-api/error');

var configurationSchema = {
    "id": "/LoginAttempt",
    "type": "object",
    "properties": {
        "username": {"type":"string"},
        "password": {"type": "string"},
    "required": ["username", "password"]
    }
};
LoginResource.inputSchema =  configurationSchema;


LoginResource.resourceName = 'login';
module.exports = LoginResource;
function LoginResource(){
    this.inputSchema = LoginResource.inputSchema;
    this.resourceName = LoginResource.resourceName;
    this.post = authenticationService.authenticate;
    this.getById = authenticationService.getToken;
    this.getAll =  function(callback){
        callback(new Error(401, 'Unauthorized'));
    };
    this.put = function(id, object, callback){
        callback(new Error(401, 'Unauthorized'));
    }
    this.delete = function(id, callback){
        callback(new Error(401, 'Unauthorized'));
    }
};


