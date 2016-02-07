var http = require('http');
var restAPI = require('./rest-api');
var portNumber = 8080;


restAPI.addResource('hello-world', require('./hello-world'));

http.createServer(restAPI.requestDispatcher).listen(portNumber);






