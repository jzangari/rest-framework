var http = require('http');

module.exports.server = null;

module.exports.initialize = function (requestHandlerCallback) {
    this.server = http.createServer(requestHandlerCallback);
};

module.exports.listen = function () {
    this.server.listen.apply(this.server, arguments);
};

module.exports.close = function (callback) {
    this.server.close(callback);
};