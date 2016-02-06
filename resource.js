// Constructor
var Resource = function(mediaType, httpMethods) {
    this.mediaType = mediaType;
    this.httpMethods = httpMethods;
}
// properties and methods
Resource.prototype = {
    mediaType: '',
    httpMethods: ''
};
// node.js module export
module.exports = Resource;
module.exports