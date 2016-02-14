module.exports.writeHeaders = function(serverResponse, bodyLength, returnCode){
    serverResponse.writeHead(returnCode, {
        'Connection':'close',
        'Content-Type':'application/json' + '; charset=utf-8',
        'Content-Length':bodyLength
    });
};

module.exports.sendErrorResponse = function(serverResponse, error){
    try {
        var outputString = JSON.stringify(error);
    }
    this.writeHeaders(serverResponse, Buffer.byteLength(outputString, 'utf-8'), error['status']);
    serverResponse.end(outputString);
}

module.exports.addLocation = function(host, resource, id, body){
   body.links = { "this":'http://' + host + '/' + resource + '/' + id};
};

module.exports.sendSingleResponse = function(serverResponse, statusCode, host, resourceName, response){
    this.addLocation(host, resourceName, response.id, response.body)
    var body = JSON.stringify(response.body);
    var bodyLength = Buffer.byteLength(body, 'utf-8');
    this.writeHeaders(serverResponse, bodyLength, statusCode);
    serverResponse.end(body);
};

module.exports.sendEmptyResponse = function(serverResponse){
    var returnCode = 204;
    this.writeHeaders(serverResponse, 0, returnCode);
    serverResponse.end();
};