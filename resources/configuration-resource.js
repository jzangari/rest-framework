var mongoDataAccess = require('./../data/mongo-data-access');

//There is no need for a service, since this is simple crud we can leverage.
//This is a good go to for all the interfaces needed for a resource to be completely CRUD Rest.
function ConfigurationResource(){
    this.resourceName = ConfigurationResource.resourceName;

    this.save = function(configuration, successCallback, errorCallback){
        //TODO Validate the input configuration. I know, I know, still here. I've been googling.
        mongoDataAccess.save(configuration, this.resourceName, successCallback, errorCallback);
    };

    this.getById = function(id, successCallback, errorCallback){
        mongoDataAccess.getById(id, this.resourceName, successCallback, errorCallback);
    };

    this.getAll = function(successCallback, errorCallback){
        mongoDataAccess.getAll(this.resourceName, successCallback, errorCallback);
    };

    this.update = function(id, configurationUpdates, successCallback, errorCallback){
        //TODO Validate the input configuration. I know, I know.. Still here. I've been googling.
        mongoDataAccess.update(id, configurationUpdates, this.resourceName, successCallback, errorCallback);
    };

    this.del = function(id, successCallback, errorCallback){
        mongoDataAccess.delete(id, this.resourceName, successCallback, errorCallback);
    };

    this.find = function(queryParams, sortField, paginationData, successCallback, errorCallback){
        mongoDataAccess.find(queryParams, sortField, paginationData, this.resourceName, successCallback, errorCallback);
    };
}

//Define a resource name for the framework to use for the path. "/<resourceName>
ConfigurationResource.resourceName = 'configurations'
module.exports = ConfigurationResource;