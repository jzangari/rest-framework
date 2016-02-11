var mongoDataAccess = require('./../data/mongo-data-access');

//There is no need for a service, since this is simple crud we can leverage.
function ConfigurationResource(){

    this.resourceName = ConfigurationResource.resourceName;

    this.save = function(configuration, successCallback, errorCallback){
        //TODO Validate the input configuration.
        mongoDataAccess.save(configuration, this.resourceName, successCallback, errorCallback);
    };

    this.getById = function(id, successCallback, errorCallback){
        mongoDataAccess.getById(id, this.resourceName, successCallback, errorCallback);
    };

    this.getAll = function(successCallback, errorCallback){
        mongoDataAccess.getAll(this.resourceName, successCallback, errorCallback);
    };

    this.update = function(id, configurationUpdates, successCallback, errorCallback){
        //TODO Validate the input configuration.\
        mongoDataAccess.update(id, configurationUpdates, this.resourceName, successCallback, errorCallback);
    };

    this.del = function(id, successCallback, errorCallback){
        mongoDataAccess.delete(id, this.resourceName, successCallback, errorCallback);
    };
}

ConfigurationResource.resourceName = 'configurations'
module.exports = ConfigurationResource;