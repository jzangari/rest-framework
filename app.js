var rd, http, portNumber, returnCode, contentType;

portNumber = 8080;

requestDispatcher = require('./request_dispatcher');

http = require('http');
http.createServer(requestDispatcher).listen(portNumber);



