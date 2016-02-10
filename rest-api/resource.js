var responseBuilder = require('./response-builder');
var Error = require('./error');
module.exports = {
    'GET' : function get(clientRequest, serverResponse, id, service){
            var outputString;
            if(id != undefined && id != ''){
                service.getById(id,
                    function(saveResponse){
                        singleResponse(serverResponse, 200, clientRequest.headers['host'], service.resourceName, saveResponse)
                    },
                    function(){
                        responseBuilder.writeErrorResponse(serverResponse, new Error(404, 'Not Found: ' + id));
                    }
                );
            } else {
                outputString = getAllAndBuildResponse(service);
            }
    },

    'POST' : function post(clientRequest, serverResponse, body, service){
            var bodyObject = JSON.parse(body);
            service.save(bodyObject,
                function(saveResponse){
                    singleResponse(serverResponse, 201, clientRequest.headers['host'], service.resourceName, saveResponse)
                },
                function(){
                    responseBuilder.writeErrorResponse(serverResponse, new Error(400, 'Bad requqest'));
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

function singleResponse(serverResponse, statusCode, host, resourceName, response){
    responseBuilder.buildLocation(host, resourceName, response.id, response.body)
    var body = JSON.stringify(response.body);
    var bodyLength = Buffer.byteLength(body, 'utf-8');
    responseBuilder.writeHeaders(serverResponse, bodyLength, statusCode);
    serverResponse.end(body);
}