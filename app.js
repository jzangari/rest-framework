var http = require('http');
var restAPI = require('./rest-api/rest-api');
var portNumber = process.env.PORT || 8080;

//resources
restAPI.addResource('configurations', require('./resources/configurations/configuration-service'));

//Filters
restAPI.filterChain.push(require('./filters/authorization-filter').filter);

//Start the Server listening on port.
http.createServer(restAPI.handleRequest).listen(portNumber);






