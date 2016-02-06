var URL = require('url');
var routes = require('./routes');

//Parse the URL and use the routes to select a resource.
function requestDispatcher(httpRequest, httpResponse){
    var requestURL = URL.parse(httpRequest.url);
    console.log(requestURL.path);
    //Split the path by / and grab the route to use for dispatching.
    var route = routes[requestURL.path.split('/')[1]]
    if(route != undefined){
        //Get the httpMethod for the route and call the associated function.
        var method = route.httpMethods[httpRequest.method]
        if(method != undefined) {
            method(httpRequest, httpResponse);
        } else {
            notFound(httpResponse);
        }
    } else {
        notFound(httpResponse);
    }
};

function notFound(httpResponse){
    httpResponse.writeHead(404, requestURL.path + ' not found.', 'ERROR: Resource Not Found');
    httpResponse.end();
}

module.exports = requestDispatcher;