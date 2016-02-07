var http = require('http');
var restAPI = require('./rest-api');
var portNumber = 8080;

//Resources
restAPI.addResource('hello-world', require('./hello-world'));

//Filters
restAPI.filterChain.push(require('./authorization-filter').filter);

//Start the Server listening on port.
http.createServer(restAPI.requestDispatcher).listen(portNumber);






