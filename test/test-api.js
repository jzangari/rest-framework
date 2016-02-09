var http = require('http');
var https = require('https');
var url = require('url');


var body = '';
var options = {
    "host": 'localhost',//'jzangari-tenable.herokuapp.com',
    "port": 8080,
    "path": '/configurations',
    "method": 'POST'
};
var postRequest = http.request(options, function(response) {
    console.log('STATUS: ' + response.statusCode);
    console.log('HEADERS: ' + JSON.stringify(response.headers));
    response.on('data', function (chunk) {
        body = chunk.toString();
        console.log('BODY: ' + body);
        var result = JSON.parse(body);
        if(result.location != undefined) {
            var configUrl = url.parse(result.location);
            options.path = configUrl.path;
            options.method = 'GET';
            try {
                var getRequest = https.request(options, function (response) {
                    console.log('STATUS: ' + response.statusCode);
                    console.log('HEADERS: ' + JSON.stringify(response.headers));
                    response.on('data', function (chunk) {
                        console.log('BODY: ' + chunk);
                        body = chunk;
                    });
                });
                getRequest.end();
            } catch (error){
                console.log(error);
            }
        }
    });
});
postRequest.write(JSON.stringify(
    {
        "name":"config-servier",
        "hostname":"192.168.1.1",
        "port":80,
        "username":"jzangari"
    }
))
postRequest.end();







