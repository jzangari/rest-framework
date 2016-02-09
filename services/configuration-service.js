//The "database" for now.
var configurations = {};

module.exports.addConfiguration = function(configuration){
    var uuid = generateUUID();
    configurations[uuid] = configuration;
    return {"id":uuid,"body":configuration};
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
    var currentConfiguration = this.getConfiguration(id, notFound);
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

//I won't lie, I give credit where it is due, since I was worried about load testing and collision.
//http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
function generateUUID(){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
}