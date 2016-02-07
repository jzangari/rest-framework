var configurations = {};

module.exports.addConfiguration = function addConfiguration(configuration){
    var uuid = generateUUID();
    configurations[uuid] = configuration;
    return uuid;
};

module.exports.getConfiguration = function getConfiguration(id){
    return configurations[id];
};

module.exports.getConfigurationKeys = function getConfigurations(id){
   var configList = [];
    for(var key in configurations){
       configList.push(key);
   }
    return configList;
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