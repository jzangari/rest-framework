module.exports.writeHeaders = function(serverResponse, bodyLength, returnCode){
    serverResponse.writeHead(returnCode, {
        'Connection':'close',
        'Content-Type':'application/json' + '; charset=utf-8',
        'Content-Length':bodyLength
    });
};

module.exports.buildLocation = function(httpRequest, resource, id){
   return 'http://' + httpRequest.headers['host'] + '/' + resource + '/' + id;
};