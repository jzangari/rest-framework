var responseBuilder = require('./response-builder');
var Error = require('./error');
module.exports = {
    'GET' : function get(clientRequest, serverResponse, id, service){
            var outputString, bodyLength, returnCode;
            if(id != undefined){
                outputString = service.getById(id, function(){
                    responseBuilder.writeErrorResponse(serverResponse, new Error(404, 'Not Found: ' + id));
                })
            } else {
                outputString = allConfigurations(clientRequest.headers['host']);
            }
            returnCode = 200;
            bodyLength = Buffer.byteLength(outputString, 'utf-8');
            responseBuilder.writeHeaders(serverResponse, bodyLength, returnCode);
            serverResponse.end(outputString);
    },

    'POST' : function post(clientRequest, serverResponse, body, service){
            var configuration = JSON.parse(body);
            var id = service.save(configuration);
            var returnCode = 201;
            var response = JSON.stringify({
                'location': responseBuilder.buildLocation(clientRequest.headers['host'], service.resourceName, id)
            });
            var bodyLength = Buffer.byteLength(response, 'utf-8');
            responseBuilder.writeHeaders(serverResponse, bodyLength, returnCode);
            serverResponse.end(response);
    },

    'PUT' : function put(clientRequest, serverResponse, body, id, service){
        var configuration = JSON.parse(body);
        service.update(id, configuration,
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

    'DELETE' : function del(clientRequest, serverResponse, id, service){
        var returnCode;
        if(id != undefined){
            service.del(id, function(){
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

function allConfigurations(host, service) {
    var configKeys = service.getAllIds();
    var configLocations = []
    configKeys.forEach(function (id) {
        configLocations.push(responseBuilder.buildLocation(host, service.resourceName, id));
    });
    return JSON.stringify(configLocations);
};