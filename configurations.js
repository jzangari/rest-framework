var configurationAccess = require('./configuration-access');
var responseBuilder = require('./response-builder');
var resource = 'configurations';
module.exports = {
    'GET' : function get(httpRequest, httpResponse, id){
            var outputString, bodyLength, returnCode;
            if(id != undefined){
                outputString = getConfiguration(id);
            } else {
                outputString = allConfigurations(httpRequest);
            }
            returnCode = 200;
            bodyLength = Buffer.byteLength(outputString, 'utf-8');
            responseBuilder.writeHeaders(httpResponse, bodyLength, returnCode);
            httpResponse.end(outputString);
    },

    'POST' : function post(httpRequest, httpResponse, body){
            var configuration = JSON.parse(body);
            var id = configurationAccess.addConfiguration(configuration);
            var returnCode = 201;
            var response = JSON.stringify({
                'location': responseBuilder.buildLocation(httpRequest, resource, id)
            });
            var bodyLength = Buffer.byteLength(response, 'utf-8');
            responseBuilder.writeHeaders(httpResponse, bodyLength, returnCode);
            httpResponse.end(response);
    },

    'PUT' : function put(){

    }
};

function getConfiguration(id) {
    var configuration = configurationAccess.getConfiguration(id);
    if (configuration != null && configuration != undefined) {
        return JSON.stringify(configuration);
    }
};

function allConfigurations(httpRequest) {
    var configKeys = configurationAccess.getConfigurationKeys();
    var configLocations = {}
    configKeys.forEach(function (key) {
        configLocations['key'] = responseBuilder.buildLocation(httpRequest, resource, key);
    });
    return JSON.stringify(configLocations);
};