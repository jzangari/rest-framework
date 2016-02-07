var resources = {};
module.exports.addResource = function addResource(resourceName, endpoints){
    resources[resourceName] = endpoints;
};

var filterChain = [];
module.exports.filterChain = filterChain;

//Parse the URL and use the resources to select a resource.
module.exports.handleRequest = function handleRequest(httpRequest, httpResponse){
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
    dispatch(httpRequest, httpResponse);
};


function dispatch(clientRequest, serverResponse){
    var urlTokens = clientRequest.url.split('/');
    var resource = resources[urlTokens[1].toLowerCase()];
    if(resource == undefined){
        serverResponse.writeHead(404);
        serverResponse.end('Not Found: ' + serverResponse.url);
    }
    //Get and Check Resource
    var method = resource[clientRequest.method];
    if(method == undefined){
        serverResponse.writeHead(405);
        serverResponse.end('Not Found: ' + serverResponse.url);
    }

    //Depending on the http request method, call the associated method type.
    // TODO Switch this to the http method
    switch(clientRequest.method){
        case 'POST':
            post(clientRequest, serverResponse, method);
            break;
        case 'GET':
            get(clientRequest, serverResponse, method, urlTokens)
            break;
        case 'PUT':
            break;
        case 'DELETE':
            break;
        default:
            serverResponse.writeHead(405);
            serverResponse.end('Not Supported: ' + method);
    }

}

function get(clientRequest, serverResponse, method, urlTokens){
    //The second URL token is going to be where our ID's set, if they are there.
    if(urlTokens[2] != undefined){
        //Send with ID if it exist.
        method(clientRequest, serverResponse, urlTokens[2]);
    } else {
        //without if it doesn't
        method(clientRequest, serverResponse);
    }
}
//TODO Fix: POSTs with no data won't hit the events, and since there is no data, the request was bad.
function post(clientRequest, serverResponse, method) {
    var body, methodCalled = false;
    clientRequest.on('data', function (data) {
        body = data.toString();
    });
    clientRequest.on('end', function () {
        methodCalled = true;
        method(clientRequest, serverResponse, body);
    });
}



