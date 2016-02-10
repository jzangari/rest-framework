var mongoDAO = require('./../rest-api/mongo-dao');

//The "database" for now.
var configurations = {};


module.exports.addConfiguration = function(configuration, successCallback, errorCallback){
    mongoDAO.save(configuration, "configurations", successCallback, errorCallback);
};

module.exports.getConfiguration = function(id, successCallback, errorCallback){
    mongoDAO.getById(id, "configurations", successCallback, errorCallback);
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
