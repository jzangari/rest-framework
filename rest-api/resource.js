var responseBuilder = require('./response-builder');
var Error = require('./error');
module.exports = {
    'GET' : function get(clientRequest, serverResponse, id, service){
            var outputString, bodyLength, returnCode;
            if(id != undefined && id != ''){
                var response = service.getById(id, function(){
                    responseBuilder.writeErrorResponse(serverResponse, new Error(404, 'Not Found: ' + id));
                })
                outputString = JSON.stringify(response);
            } else {
                outputString = getAllAndBuildResponse(service);
            }
            returnCode = 200;
            bodyLength = Buffer.byteLength(outputString, 'utf-8');
            responseBuilder.writeHeaders(serverResponse, bodyLength, returnCode);
            serverResponse.end(outputString);
    },

    'POST' : function post(clientRequest, serverResponse, body, service){
            var bodyObject = JSON.parse(body);
            service.save(bodyObject,
                function(status){
                    responseBuilder.writeHeaders(serverResponse, 0, status);
                    serverResponse.end();
                },
                function(saveResponse){
                    var returnCode = 201;
                    responseBuilder.buildLocation(clientRequest.headers['host'], service.resourceName, saveResponse.id, saveResponse.body)
                    var response = JSON.stringify(saveResponse.body);
                    var bodyLength = Buffer.byteLength(response, 'utf-8');
                    responseBuilder.writeHeaders(serverResponse, bodyLength, returnCode);
                    serverResponse.end(response);
                }
            );
    },

    'PUT' : function put(clientRequest, serverResponse, body, id, service){
        var configuration = JSON.parse(body);
        if(id == ''){
            responseBuilder.writeErrorResponse(serverResponse, new Error(400, 'Cannot update a collection root.'));
        } else {
            service.update(id, configuration,
                function () {
                    responseBuilder.writeErrorResponse(serverResponse, new Error(404, 'Not Found: ' + id));
                },
                function (field) {
                    responseBuilder.writeErrorResponse(serverResponse, new Error(400, 'Bad Request: Field is invalid for configuration:' + field));
                });
        }
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

function getAllAndBuildResponse(service) {
    var resources = service.getAll();
    var resourceName = service.resourceName;
    var allItemsResponse = {}
    allItemsResponse[resourceName] = [];
    for(var id in resources){
        allItemsResponse[resourceName].push(resources[id]);
    };
    return JSON.stringify(allItemsResponse);
};