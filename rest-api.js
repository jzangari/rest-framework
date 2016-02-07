var URL = require('url');
var resources = {};

module.exports.addResource = function addResouce(path, endpoints){
    resources[path] = endpoints;
}

//Parse the URL and use the resources to select a resource.
module.exports.requestDispatcher = function requestDispatcher(httpRequest, httpResponse){
    var requestURL = httpRequest.url;
    console.log('Request for ' + requestURL + ' being dispatched.');

    // Since most of the APIs I build tend to deal strictly with the media application/json, even in production,
    // I am going to make an assumption and kick out anything that isn't json. Leaving undefined to make testing easier for now.
    var contentType = httpRequest.headers['content-type'];
    if((contentType != 'application/json') && (contentType != undefined)){
        console.log('Unsupported media type from request: ' + contentType);
        httpResponse.writeHead(415, 'Resource only supports application/json');
        httpResponse.end();
    }

    //Split the path by / and grab the resource to use for dispatching.
    var resource = resources[requestURL.split('/')[1]];
    if(resource != undefined){

        //Get the httpMethod for the resource and call the associated function.
        var method = resource[httpRequest.method];
        if(method != undefined) {
            method(httpRequest, httpResponse);
        } else {
            unsupportedOperation(httpRequest.method, httpResponse);
        }

    } else {
        notFound(requestURL, httpResponse);
    }
};

module.exports.notFound = function notFound(requestURL, httpResponse){
    httpResponse.writeHead(404, requestURL.path + ' not found.', 'ERROR: Resource Not Found');
    httpResponse.end();
}

module.exports.unsupportedOperation = function unsupportedOperation(httpMethod, httpResponse){
    httpResponse.writeHead(501, httpMethod + ' is unsupported', 'ERROR: Unsupported Operation');
    httpResponse.end();
}

