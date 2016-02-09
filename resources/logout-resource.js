var authenticationService = require('./../services/authentication-service')

function LogoutResource(){
    this.resourceName = LogoutResource.resourceName;
    this.update =  authenticationService.invalidateAuthentication
}

LogoutResource.resourceName = 'invalidateAuthentication'
module.exports = LogoutResource;
