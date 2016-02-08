var configurationService = require('./configuration-service');
var responseBuilder = require('./../../rest-api/response-builder');
var Error = require('./../../rest-api/error');
var resource = 'configurations';
module.exports = {
    'GET' : function get(clientRequest, serverResponse, id){
            var outputString, bodyLength, returnCode;
            if(id != undefined){
                outputString = configurationService.getConfiguration(id, function(){
                    responseBuilder.writeErrorResponse(serverResponse, new Error(404, 'Not Found: ' + id));
                })
            } else {
                outputString = allConfigurations(clientRequest);
            }
            returnCode = 200;
            bodyLength = Buffer.byteLength(outputString, 'utf-8');
            responseBuilder.writeHeaders(serverResponse, bodyLength, returnCode);
            serverResponse.end(outputString);
    },

    'POST' : function post(clientRequest, serverResponse, body){
            var configuration = JSON.parse(body);
            var id = configurationService.addConfiguration(configuration);
            var returnCode = 201;
            var response = JSON.stringify({
                'location': responseBuilder.buildLocation(clientRequest.headers['host'], resource, id)
            });
            var bodyLength = Buffer.byteLength(response, 'utf-8');
            responseBuilder.writeHeaders(serverResponse, bodyLength, returnCode);
            serverResponse.end(response);
    },

    'PUT' : function put(clientRequest, serverResponse, body, id){
        var configuration = JSON.parse(body);
        configurationService.updateConfiguration(id, configuration,
            function(){
                responseBuilder.writeErrorResponse(serverResponse, new Error(404, 'Not Found: ' + id));
            },
            function(field){
                responseBuilder.writeErrorResponse(serverResponse, new Error(400, 'Bad Request: Field is invalid for configuration:' + field));
            });
        var returnCode = 204;
        responseBuilder.writeHeaders(serverResponse, 0, returnCode);
        serverResponse.end();
    },

    'DELETE' : function del(clientRequest, serverResponse, id){
        var returnCode;
        if(id != undefined){
            configurationService.removeConfiguration(id, function(){
                responseBuilder.writeErrorResponse(serverResponse, new Error(404, 'Not Found: ' + id));
            });
        } else {
            responseBuilder.writeErrorResponse(serverResponse, new Error(40, 'Bad Request: Cannot Delete Collection.'));
        }
        returnCode = 204;
        responseBuilder.writeHeaders(serverResponse, 0, returnCode);
        serverResponse.end();
    },
};

function allConfigurations(clientRequest) {
    var configKeys = configurationService.getConfigurationKeys();
    var configLocations = []
    configKeys.forEach(function (id) {
        configLocations.push(responseBuilder.buildLocation(clientRequest.headers['host'], resource, id));
    });
    return JSON.stringify(configLocations);
};