module.exports = {
    'GET' : function(httpRequest, httpResponse){
        var body = '';
        httpRequest.on('data', function(data){
            body = data.toString();
        });

        httpRequest.on('end', function(){
            var outputString, bodyLength, returnCode, contentType;

            outputString = 'Hello World<br>\n';
            outputString += 'method: ' + httpRequest.method + '\n';

            returnCode = 200;
            contentType = "text/html";

            bodyLength = Buffer.byteLength(outputString, 'utf-8');

            httpResponse.writeHead(returnCode, {
                'Connection':'close',
                'Content-Type':contentType + '; charset=utf-8',
                'Content-Length':bodyLength
            });

            httpResponse.end(outputString);
        });
    },

    'POST' : function(httpRequest, httpResponse){
        var body = '';
        httpRequest.on('data', function(data){
            body = data.toString();
        });

        httpRequest.on('end', function(){
            var outputString, bodyLength, returnCode, contentType;

            outputString = 'Hello World<br>\n';
            outputString += 'method: ' + httpRequest.method + '\n';
            outputString += 'POST Data: \n';
            outputString += body;

            returnCode = 200;
            contentType = "text/html";

            bodyLength = Buffer.byteLength(outputString, 'utf-8');

            httpResponse.writeHead(returnCode, {
                'Connection':'close',
                'Content-Type':contentType + '; charset=utf-8',
                'Content-Length':bodyLength
            });

            httpResponse.end(outputString);
        });
    }
};