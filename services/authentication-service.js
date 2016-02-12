var authorizationTokens = {}
var tokenIndex = {}

var Error = require('../rest-api/error');
var mongoDataAccess = require('../data/mongo-data-access');

// loginAttempt & user = { "username":"<username>", "password":"<password>" }
module.exports.authenticate = function(loginAttempt, successCallback, failureCallback){
    console.log('Login Attempt for: ' + loginAttempt.username)
    //Just quick and dirty password checking for now. Find a match!
    mongoDataAccess.find({"$and":[{"username":{"$eq":loginAttempt.username}},{"password":{"$eq":loginAttempt.password}}]}
        , undefined, undefined, 'users', function(users){
        //If we find one user, create ans save a token for the user.
        if(users.length == 1){
            console.log('Authorization Token created for: ' + loginAttempt.username);
            var token = {
                "token":generateToken(),
                "expires":new Date(new Date().getTime() + 30000), //5 minutes
                "valid":true,
                "user":users[0].body.username
            };
            mongoDataAccess.save(token, 'authorizationTokens', successCallback, failureCallback);
        } else {
            failureCallback(new Error(401, 'Unauthorized'));
        }
    }, failureCallback);
};


module.exports.getToken = function(id, successCallback, errorCallback){
    mongoDataAccess.getById(id, 'authorizationTokens', successCallback, errorCallback);
};


module.exports.invalidateAuthorization = function(token, successCallback, errorCallback){
    mongoDataAccess.find({"token":token}, undefined, undefined, 'authorizationTokens', function(tokens){
        var updates = {"valid":false};
        if(tokens.length == 1){
            var id = tokens[0].id;
            mongoDataAccess.update(id, updates, 'authorizationTokens',
                successCallback,
                errorCallback);
        } else {
            console.error('Authorization Token Collision! Invalidating all of them.');
            invalidateTokens(tokens, errorCallback);
        }
    }, errorCallback);
}

module.exports.authorizeToken = function(token, authorized){
    mongoDataAccess.find({"$and":[{"token":{"$eq":token}},{"valid":{"$eq":true}}]}, undefined, undefined, 'authorizationTokens', function(tokens){
        if(tokens.length == 1){
            authorized(true);
        } else {
            console.log('Authorization Token Collision! Invalidating all of them.');
            invalidateTokens(tokens, function(error){
                console.log(error);
                authorized(false);
            });
        }
    }, function(err){
        console.log('Failed while authorizing token: ' + token + ' with error ' + err);
        return false;
    });
}

var invalidateTokens = function(tokens, failureCallback){
    for(var current in tokens){
        mongoDataAccess.update(tokens[current]._id, {"valid":false}, 'authorizationTokens',
            function(){console.error('Token invalidated: +' + tokens[current])},
            function(err){
                console.error('Error while invalidating token:\n' + err);
            });
    }
    failureCallback(new Error(500, 'Multiple Token Instances Found. All of them have been De-authorized as a security measure.'));
}


//I won't lie, I give credit where it is due, since I was worried about load testing and collision.
//http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
function generateToken(){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
}