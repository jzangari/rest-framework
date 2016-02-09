//The "Databases" for now.
var userCredentials = {
    "drwho":"becausehecan",
    "tenable":"securityRox"
};
var authorizationTokens = {}
var tokenIndex = {}

//Interval for invalidating tokens.
var timers = require('timers');
timers.setInterval(
    function(){
        for(var username in authorizationTokens){
           if(this.getTime() >= authorizationTokens[username].expires.getTime()){
               authorizationTokens[username].valid = false;
               tokenIndex[authorizationTokens[username].token] = authorizationTokens[username];
               console.log('Authorization Token expired for: ' + username);
           }
        }
    },
    300000
);

// loginAttempt = { "username":"<username>", "password":"<password>" }
module.exports.authenticate = function(loginAttempt, loginFailureCallback){
    console.log('Login Attempt for: ' + loginAttempt.username)
    //Just quick and dirty password checking for now.
    var realPassword = userCredentials[loginAttempt.username];
    if(realPassword == loginAttempt['password']){
        console.log('Authorization Token created for: ' + loginAttempt.username);
        var token = {
            "token":generateToken(),
            "expires":new Date(new Date().getTime() + 30000), //5 minutes
            "valid":true
        }
        authorizationTokens[loginAttempt.username] = token;
        tokenIndex[token.token] = token;
        return {"id":token.token, "body":token};
    } else {
        loginFailureCallback(401);
    }
};


module.exports.getToken = function(token, notFound){
    if(tokenIndex[token] != undefined){
        return tokenIndex[token];
    } else {
        notFound();
    }
};


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