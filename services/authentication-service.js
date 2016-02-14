var Error = require('../rest-api/error');
var mongoDataAccess = require('../data/mongo-data-access');


if(false) {
    var i =0;
    console.log(i);
    setInterval(function () {
        console.log('Cleaning up expired tokens...');
        mongoDataAccess.find({"$and": [{"valid": {"$eq": true}}, {"expires": {"$lte": new Date().toISOString()}}]},
            undefined, undefined, 'authorizationTokens',
            function (err, tokens) { //success
                if(err){

                    console.log(JSON.stringify(err));
                }
                console.log(tokens.length + ' expired tokens found.')
                if (tokens.length >= 1) invalidateTokens(tokens);
            }
        )},
        30000 //30 second interval
    );
}

// loginAttempt & user = { "username":"<username>", "password":"<password>" }
module.exports.authenticate = function(loginAttempt, callback){
    console.log('Login Attempt for: ' + loginAttempt.username)
    //Just quick and dirty password checking for now. Find a match!
    mongoDataAccess.find({"$and":[{"username":{"$eq":loginAttempt.username}},{"password":{"$eq":loginAttempt.password}}]}
        , undefined, undefined, 'users', function(error, users){
        if(error){
            callback(error);
        }
        //If we find one user, create ans post a token for the user.
        if(users.length == 1){
            console.log('Authorization Token created for: ' + loginAttempt.username);
            var token = {
                "token":generateToken(),
                "expires":new Date(new Date().getTime() + 300000).toISOString(), //5 minutes
                "valid":true,
                "user":users[0].body.username
            };
            mongoDataAccess.post(token, 'authorizationTokens', callback);
        } else {
            callback(new Error(401, 'Unauthorized'));
        }
    });
};


module.exports.getToken = function(id, callback){
    mongoDataAccess.getById(id, 'authorizationTokens', callback);
};


module.exports.invalidateAuthorization = function(token, callback){
    mongoDataAccess.find({"token":token}, undefined, undefined, 'authorizationTokens', function(error, tokens){
        if(error){
            callback(error);
        }
        var updates = {"valid":false};
        if(tokens.length == 1){
            var id = tokens[0].id;
            mongoDataAccess.put(id, updates, 'authorizationTokens',
                callback);
        } else {
            console.error('Authorization Token Collision! Invalidating all of them.');
            invalidateTokens(tokens, callback);
        }
    });
}

module.exports.authorizeToken = function(token, authorizedCallback){
    mongoDataAccess.find({"$and":[{"token":{"$eq":token}},{"valid":{"$eq":true}}]}, undefined, undefined, 'authorizationTokens', function(error, tokens){
        if(error){
            authorizedCallback(false);
        }
        if(tokens.length == 1){
            authorizedCallback(true);
        } else {
            console.log('Authorization Token Collision! Invalidating all of them.');
            invalidateTokens(tokens, function(error){
                console.log(error);
                authorizedCallback(false);
            });
        }
    });
}

var invalidateTokens = function(tokens){
    for(var current in tokens){
        mongoDataAccess.put(tokens[current].id, {"valid":false}, 'authorizationTokens',
            function(err){
                if(err){
                    console.error('Token invalidated: +' + JSON.stringify(tokens[current]))
                }else{
                    console.error('Error while invalidating token:\n' + JSON.stringify(err) + '\n' + JSON.stringify(tokens))
                }
            });
    }
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

