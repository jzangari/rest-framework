var responseBuilder = require('./response-builder');
var Error = require('./error');
module.exports = {
    'GET' : function get(clientRequest, serverResponse, id, service){
            if(id != undefined && id != ''){
                service.getById(id,
                    function(response){
                        sendSingleResponse(serverResponse, 200, clientRequest.headers['host'], service.resourceName, response)
                    },
                    function(error){
                        responseBuilder.writeErrorResponse(serverResponse, error);
                    }
                );
            } else {
                getAllAndBuildResponse(serverResponse, clientRequest.headers['host'], service);
            }
    },

    'POST' : function post(clientRequest, serverResponse, body, service){
            var bodyObject = JSON.parse(body);
            service.save(bodyObject,
                function(response){
                    sendSingleResponse(serverResponse, 201, clientRequest.headers['host'], service.resourceName, response)
                },
                function(error){
                    responseBuilder.writeErrorResponse(serverResponse, error);
                }
            );
    },

    'PUT' : function put(clientRequest, serverResponse, body, id, service){
        var configuration = JSON.parse(body);
        if(id == ''){
            responseBuilder.writeErrorResponse(serverResponse, new Error(400, 'Cannot update a collection root.'));
        } else {
            service.update(id, configuration,
                function () {sendEmptyResponse(serverResponse);},
                function (error) {
                    responseBuilder.writeErrorResponse(serverResponse, error);
                });
        }
    },

    'DELETE' : function del(clientRequest, serverResponse, id, service){
        if(id != undefined){
            service.del(id,
                function(){
                    responseBuilder.writeHeaders(serverResponse, 0, 204);
                    serverResponse.end();
                },
                function(error){
                    responseBuilder.writeErrorResponse(serverResponse, error);
                });
        } else {
            responseBuilder.writeErrorResponse(serverResponse, new Error(400, 'Bad Request: Cannot Delete Collection.'));
        }
    },
};

function getAllAndBuildResponse(serverResponse, host, service) {
    var items = []
    service.getAll(
        function(responses){
            for(var current in responses){
                var response = responses[current];
                responseBuilder.addLocation(host, service.resourceName, response.id, response.body);
                items.push(response.body);
            }

            var body = JSON.stringify(items);
            var bodyLength = Buffer.byteLength(body, 'utf-8');
            responseBuilder.writeHeaders(serverResponse, bodyLength, 200);
            serverResponse.end(body);
        },
        function(err){
            responseBuilder.writeErrorResponse(serverResponse, err);
        }
    );
};

function sendSingleResponse(serverResponse, statusCode, host, resourceName, response){
    responseBuilder.addLocation(host, resourceName, response.id, response.body)
    var body = JSON.stringify(response.body);
    var bodyLength = Buffer.byteLength(body, 'utf-8');
    responseBuilder.writeHeaders(serverResponse, bodyLength, statusCode);
    serverResponse.end(body);
}

function sendEmptyResponse(serverResponse){
        var returnCode = 204;
        responseBuilder.writeHeaders(serverResponse, 0, returnCode);
        serverResponse.end();
}
