var http = require('http');
var restAPI = require('./rest-api/rest-api');

module.exports.server = http.createServer(restAPI.handleRequest);

module.exports.listen = function () {
    this.server.listen.apply(this.server, arguments);
};

module.exports.close = function (callback) {
    this.server.close(callback);
};