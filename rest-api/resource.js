var responseBuilder = require('./response-builder');
var Error = require('./error');
module.exports = {
    'GET' : function get(clientRequest, serverResponse, id, queryParams, service){
            //Check and see if this get has an ID associated with it.
            if(id != undefined && id != ''){
                console.log('GET method on resource: ' + service.resourceName + ' with id: ' + id);
                service.getById(id,
                    function(err, response){
                        if(err){
                            responseBuilder.sendErrorResponse(serverResponse, err)
                        }else {
                            responseBuilder.sendSingleResponse(serverResponse, 200, clientRequest.headers['host'], service.resourceName, response)
                        }

                    });
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

                queryAndSendResponse(serverResponse, clientRequest.headers['host'], service, queryParams, sortField, paginationData);
            }
    },

    'POST' : function post(clientRequest, serverResponse, body, resource){
        console.log('POST method on resource: ' + resource.resourceName);
        try {
            var bodyObject = JSON.parse(body);
        } catch(err){
            responseBuilder.sendErrorResponse(serverResponse, new Error(400, 'Invalid JSON sent.\n' + err));
        }
        if(bodyObject != undefined) {
            resource.post(bodyObject,function(err,response){
                if(err){
                    responseBuilder.sendErrorResponse(serverResponse, error);
                }
                else{
                    responseBuilder.sendSingleResponse(serverResponse, 201, clientRequest.headers['host'], resource.resourceName, response)
                }
            })
        }
    },

    'PUT' : function put(clientRequest, serverResponse, body, id, service){
        console.log('PUT method on resource: ' + service.resourceName + ' with id: ' + id);
        if(id == ''){
            responseBuilder.sendErrorResponse(serverResponse, new Error(400, 'Cannot put a collection root.'));
        } else {
            try {
                var bodyObject = JSON.parse(body);
            } catch(err){
                responseBuilder.sendErrorResponse(serverResponse, new Error(400, 'Invalid JSON sent.\n' + err));
            }
            if(bodyObject != undefined){
                service.put(id, bodyObject, function(err){
                    if(err){
                        responseBuilder.sendErrorResponse(serverResponse, err)
                    } else{
                        responseBuilder.sendEmptyResponse(serverResponse)
                    }
                })
            }
        }
    },

    'DELETE' : function del(clientRequest, serverResponse, id, service){
        console.log('DELETE method on resource: ' + service.resourceName + ' with id: ' + id);
        if(id != undefined){
            service.del(id, function(err){
                if(err){
                    responseBuilder.sendErrorResponse(serverResponse, err);
                } else{
                    responseBuilder.sendEmptyResponse(serverResponse)
                }
            })
        } else {
            responseBuilder.sendErrorResponse(serverResponse, new Error(400, 'Bad Request: Cannot Delete Collection.'));
        }
    },
};

function queryAndSendResponse(serverResponse, host, service, queryParams, sortField, paginationData) {
    var items = []
    service.find(queryParams, sortField, paginationData,
        function(err, responses){
            if(err){
                responseBuilder.sendErrorResponse(serverResponse, err);
            }
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
        }
    );
};


