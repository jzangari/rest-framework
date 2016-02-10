var mongoDAO = require('./../rest-api/mongo-dao');

//The "database" for now.
var configurations = {};


module.exports.addConfiguration = function(configuration, errorCallback, successCallback){
    mongoDAO.save(configuration, "configurations", errorCallback, successCallback);
};

module.exports.getConfiguration = function(id, notFound){
    var configuration = configurations[id];
    if (configuration != null && configuration != undefined) {
        return configuration;
    } else {
        notFound();
    }
}

module.exports.getConfigurations = function (){
    return configurations;
};

module.exports.updateConfiguration = function(id, configurationUpdates, notFound, badRequest){
    var currentConfiguration = configurations[id];
    if (currentConfiguration == null || currentConfiguration == undefined) {
        notFound();
    }
    //Check to make sure the thing sent in actually is valid compared to the current version we have.
    for(var field in configurationUpdates){
        if(currentConfiguration[field] == undefined){
            badRequest(field);
        }
    }
    //To avoid messy transaction handling, I'm just doing this in a separate loop.
    for(var field in configurationUpdates){
        currentConfiguration[field] = configurationUpdates[field];
    }
};

module.exports.removeConfiguration = function(id, notFound){
    if(configurations[id] != undefined){
        delete configurations[id];
    } else {
        notFound();
    }
};
