var mongoDataAccess = require('./../data/mongo-data-access');


var configurationSchema = {
    "id": "/Configuration",
    "type": "object",
    "properties": {
        "name": {"type":"string"},
        "hostname": {"type": "string"},
        "port":{
            "type": "number",
            "minimum": 1,
            "maximum": 65535,
            "exclusiveMaximum": true
        },
        "username": {"type": "string"}
    },
    "required": ["name", "hostname", "port", "username"]
};

ConfigurationResource.inputSchema =  configurationSchema;


//There is no need for a service, since this is simple crud we can leverage.
//This is a good go to for all the interfaces needed for a resource to be completely CRUD Rest.
function ConfigurationResource(){
    this.resourceName = ConfigurationResource.resourceName;

    this.post = function(configuration, callback){
        //TODO Validate the input configuration. I know, I know, still here. I've been googling.
        mongoDataAccess.post(configuration, this.resourceName, callback);
    };

    this.getById = function(id, callback){
        mongoDataAccess.getById(id, this.resourceName, callback);
    };

    this.getAll = function(callback){
        mongoDataAccess.getAll(this.resourceName, callback);
    };

    this.put = function(id, configurationUpdates, callback){
        //TODO Validate the input configuration. I know, I know.. Still here. I've been googling.
        mongoDataAccess.put(id, configurationUpdates, this.resourceName, callback);
    };

    this.del = function(id, callback){
        mongoDataAccess.delete(id, this.resourceName, callback);
    };

    this.find = function(queryParams, sortField, paginationData, callback){
        mongoDataAccess.find(queryParams, sortField, paginationData, this.resourceName, callback);
    };
}

//Define a resource name for the framework to use for the path. "/<resourceName>
ConfigurationResource.resourceName = 'configurations';
module.exports = ConfigurationResource;