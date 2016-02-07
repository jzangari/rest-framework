var resources = {};
var filterChain = [];
module.exports.filterChain = filterChain;

//Parse the URL and use the resources to select a resource.
module.exports.requestDispatcher = function requestDispatcher(httpRequest, httpResponse){
    //Run the filter chain. Very "java" way of doing it.
    //TODO I think this would be better handled as "middleware"... It's a term that keeps coming up in googles.
    filterChain.forEach(function(filter){
        filter(httpRequest, httpResponse);
    });

    //Grab the URL. Example: http://localhost:80808/stuff/id?foo=bar returns "/stuff/id"
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

    //Split the path by / and grab the resource to use for dispatching, lowercase for comparison.
    var resource = resources[requestURL.split('/')[1].toLowerCase()];
    if(resource != undefined){

        //Get the httpMethod for the resource and call the associated function.
        var method = resource[httpRequest.method];
        if(method != undefined) {
            //read the body of the message to pass.
            var body = ''
            httpRequest.on('data', function(data){
                body = data.toString();
            });

            method(httpRequest, httpResponse, body);
        } else {
            httpResponse.writeHead(501);
            httpResponse.end('Not Supported: ' + method);
        }

    } else {
        httpResponse.writeHead(404);
        httpResponse.end('Not Found: ' + requestURL);
    }
};


module.exports.addResource = function addResouce(resourceName, endpoints){
    resources[resourceName] = endpoints;
};

