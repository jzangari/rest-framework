var server = require('./server');
var restAPI = require('./rest-api/rest-api');
var configResource = require('./resources/configuration-resource');
var loginResource = require('./resources/login-resource');
var portNumber = Number(process.env.PORT || 8080);


//resources
restAPI.addResource(configResource.resourceName, configResource);
restAPI.addResource(loginResource.resourceName, loginResource);
//Filters
restAPI.filterChain.push(require('./filters/authorization-filter').filter);

server.listen(portNumber);







