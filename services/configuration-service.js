var mongoDAO = require('./../rest-api/mongo-dao');

//The "database" for now.
var configurations = {};


module.exports.addConfiguration = function(configuration, successCallback, errorCallback){
    //TODO Validate the input configuration.
    mongoDAO.save(configuration, "configurations", successCallback, errorCallback);
};

module.exports.getConfiguration = function(id, successCallback, errorCallback){
    mongoDAO.getById(id, "configurations", successCallback, errorCallback);
}

module.exports.getConfigurations = function (successCallback, errorCallback){
    mongoDAO.getAll("configurations", successCallback, errorCallback);
};

module.exports.updateConfiguration = function(id, configurationUpdates, successCallback, errorCallback){
    //TODO Validate the input configuration.\
    mongoDAO.update(id, configurationUpdates, "configurations", successCallback, errorCallback);
};

module.exports.removeConfiguration = function(id, successCallback, errorCallback){
    mongoDAO.delete(id, "configurations", successCallback, errorCallback);
};
