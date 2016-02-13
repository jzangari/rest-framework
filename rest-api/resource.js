var responseBuilder = require('./response-builder');
var Error = require('./error');
module.exports = {
    'GET' : function get(clientRequest, serverResponse, id, queryParams, service){
            //Check and see if this get has an ID associated with it.
            if(id != undefined && id != ''){
                console.log('GET method on resource: ' + service.resourceName + ' with id: ' + id);
                service.getById(id,
                    function(response){
                        sendSingleResponse(serverResponse, 200, clientRequest.headers['host'], service.resourceName, response)
                    },
                    function(error){
                        responseBuilder.writeErrorResponse(serverResponse, error);
                    }
                );
            //No ID means it is against a collection
            } else {
                console.log('GET method called on resource: ' + service.resourceName + ' without id');
                //Set up sort field from query param.
                var sortField = undefined;
                if(queryParams.sort != undefined){
                    sortField = queryParams.sort;
                    delete queryParams['sort'];
                }

                //Set up pagination data from query params.
                var paginationData = {};
                if(queryParams.pageNumber != undefined){
                    paginationData.pageNumber =  parseInt(queryParams.pageNumber);
                    delete queryParams['pageNumber'];
                } else {
                    paginationData.pageNumber =  1;
                }
                if(queryParams.pageSize != undefined){
                    paginationData.pageSize =  parseInt(queryParams.pageSize);
                    delete queryParams['pageSize'];
                } else {
                    paginationData.pageSize = 10;
                }
                console.log('Query data setup as:\n' +  JSON.stringify(queryParams) + '\n' + sortField + '\n' + JSON.stringify(paginationData));

                getAndBuildResponse(serverResponse, clientRequest.headers['host'], service, queryParams, sortField, paginationData);
            }
    },

    'POST' : function post(clientRequest, serverResponse, body, service){
        console.log('POST method on resource: ' + service.resourceName);
        try {
            var bodyObject = JSON.parse(body);
        } catch(err){
            responseBuilder.writeErrorResponse(serverResponse, new Error(400, 'Invalid JSON sent.\n' + err));
        }
        if(bodyObject != undefined) {
            service.post(bodyObject,
                function (response) {
                    sendSingleResponse(serverResponse, 201, clientRequest.headers['host'], service.resourceName, response)
                },
                function (error) {
                    responseBuilder.writeErrorResponse(serverResponse, error);
                }
            )
        }
    },

    'PUT' : function put(clientRequest, serverResponse, body, id, service){
        console.log('PUT method on resource: ' + service.resourceName + ' with id: ' + id);
        if(id == ''){
            responseBuilder.writeErrorResponse(serverResponse, new Error(400, 'Cannot put a collection root.'));
        } else {
            try {
                var bodyObject = JSON.parse(body);
            } catch(err){
                responseBuilder.writeErrorResponse(serverResponse, new Error(400, 'Invalid JSON sent.\n' + err));
            }
            if(bodyObject != undefined){
                service.put(id, bodyObject,
                    function () {sendEmptyResponse(serverResponse);},
                    function (error) {
                        responseBuilder.writeErrorResponse(serverResponse, error);
                    });
            }
        }
    },

    'DELETE' : function del(clientRequest, serverResponse, id, service){
        console.log('DELETE method on resource: ' + service.resourceName + ' with id: ' + id);
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

function getAndBuildResponse(serverResponse, host, service, queryParms, sortField, paginationData) {
    var items = []
    service.find({}, sortField, paginationData,
        function(responses){
            console.log('Building multiple responses from query.');
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
