module.exports.writeHeaders = function(serverResponse, bodyLength, returnCode){
    serverResponse.writeHead(returnCode, {
        'Connection':'close',
        'Content-Type':'application/json' + '; charset=utf-8',
        'Content-Length':bodyLength
    });
};

module.exports.writeErrorResponse = function(serverResponse, error){
    var outputString = JSON.stringify(error);
    this.writeHeaders(serverResponse, Buffer.byteLength(outputString, 'utf-8'), error['status']);
    serverResponse.end(outputString);
}

module.exports.addLocation = function(host, resource, id, body){
   body.links = { "this":'http://' + host + '/' + resource + '/' + id};
};