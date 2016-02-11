var resourceMethods = require('./resource');
var url = require('url');

var resources = {};
module.exports.addResource = function addResource(resourceName, endpoints){
    resources[resourceName] = endpoints;
};

var filterChain = [];
module.exports.filterChain = filterChain;


//Parse the URL and use the resources to select a resource.
module.exports.handleRequest = function handleRequest(httpRequest, httpResponse){
    try {
        console.log('Handling ' + httpRequest.method + ' Request for ' + httpRequest.url);
        //Run the filter chain. Very "java" way of doing it.
        //TODO I think this would be better handled as "middleware"... It's a term that keeps coming up in googles.
        for(var current in filterChain){
            var filter = filterChain[current];
            filter(httpRequest, httpResponse);
        }

        // Since most of the APIs I build tend to deal strictly with the media application/json, even in production,
        // I am going to make an assumption and kick out anything that isn't json. Leaving undefined to make testing easier for now
        var contentType = httpRequest.headers['content-type'];
        console.log('Request has content type: ' + contentType);
        if ((httpRequest.method != 'GET') && (contentType != 'application/json') && (contentType != undefined)) {
            console.log('Unsupported media type from postRequest: ' + contentType);
            httpResponse.writeHead(415, 'Resource only supports application/json');
            httpResponse.end();
        }
        dispatch(httpRequest, httpResponse);
    //Node likes to die at the slightest error. I don't want it to die at the slightest error.
    } catch(err){
        console.log(err.stack);
        httpResponse.writeHead(500);
        httpResponse.end("There was a Server Error while processing your request");
    }
};


function dispatch(clientRequest, serverResponse){
    //Look Up Resource by the first URL token, error if not found.
    console.log('Dispatching request to mapped service/resource based on http method');
    //If there is a '?', split the path on it to find the resource.
    var path = '';
    if(clientRequest.url.indexOf('?') > -1){
        path = clientRequest.url;
        path.trim();
        path  = path.split('?')[0];
    } else {
        path = clientRequest.url.trim();
    }
    //catch all
    if(path == undefined){
        path = '/'
    }
    //Split the path on '/' and grab the lowercase version of the first thing past the initial '/', the Resource.
    var urlTokens = path.split('/');
    var Resource = resources[urlTokens[1].toLowerCase()];
    //Instantiate a new resource.
    if(Resource == undefined){
        serverResponse.writeHead(404);
        serverResponse.end('Not Found: ' + serverResponse.url);
    } else {
       var service = new Resource();
    }

    //Switch on the method and call the service
    switch(clientRequest.method){
        case 'POST':
            if(typeof service.save === 'function'){
                readBodyEventHandling(clientRequest, serverResponse, resourceMethods.POST, service, undefined);
            } else {
                serverResponse.writeHead(405);
                serverResponse.end('Not Supported: ' + method);
            }
            break;
        case 'PUT':
            if(typeof service.update === 'function'){
                readBodyEventHandling(clientRequest, serverResponse, resourceMethods.PUT, service, urlTokens);
            } else {
                serverResponse.writeHead(405);
                serverResponse.end('Not Supported: ' + method);
            }
            break;
        case 'GET':
            if(typeof service.getById === 'function' && typeof service.getAll === 'function') {
                var queryParams = url.parse(clientRequest.url, true).query;
                resourceMethods.GET(clientRequest, serverResponse, urlTokens[2], queryParams,  service);
            }
            break;
        case 'DELETE':
            if(typeof service.del === 'function') {
                resourceMethods.DELETE(clientRequest, serverResponse, urlTokens[2], service);
            }
            break;
        default:
            serverResponse.writeHead(405);
            serverResponse.end('Not Supported: ' + method);
    }
}

//This function sets up the event handling to read the body of the request, then calls the httpMethod.
function readBodyEventHandling(clientRequest, serverResponse, httpMethod, service, urlTokens) {
    var body, methodCalled = false;
    clientRequest.on('data', function (data) {
        body = data.toString();
    });
    clientRequest.on('end', function () {
        methodCalled = true;
        if(urlTokens == undefined){
            httpMethod(clientRequest, serverResponse, body, service);
        } else {
            httpMethod(clientRequest, serverResponse, body, urlTokens[2], service);
        }
    });
}





