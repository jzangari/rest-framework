var configuationService = require('./../services/configuration-service');

function ConfigurationResource(){
    this.resourceName = ConfigurationResource.resourceName;
    this.save = configuationService.addConfiguration;
    this.getById = configuationService.getConfiguration;
    this.getAll = configuationService.getConfigurations;
    this.update = configuationService.updateConfiguration;
    this.del = configuationService.removeConfiguration;
}


ConfigurationResource.resourceName = 'configurations'
module.exports = ConfigurationResource;