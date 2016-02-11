var server = require('./server');
var restAPI = require('./rest-api/rest-api');
var configResource = require('./resources/configuration-resource');
var loginResource = require('./resources/login-resource');
var logoutResource = require('./resources/logout-resource');

//Get the port from the environment.
var portNumber = Number(process.env.PORT || 8080);

//Set up the Rest API resources and filters.
restAPI.addResource(configResource.resourceName, configResource);
restAPI.addResource(loginResource.resourceName, loginResource);
restAPI.addResource(logoutResource.resourceName, logoutResource);
restAPI.filterChain.push(require('./filters/authorization-filter').filter);

//Start the server.
server.initialize(restAPI.handleRequest)
server.listen(portNumber);







