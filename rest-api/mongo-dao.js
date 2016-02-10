var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var assert = require('assert');
var url = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/jzangari-tenable'

module.exports.save = function(object, collectionName, successCallback, errorCallback){
    callCollectionFunctionWithSingleInput(object, collectionName, successCallback, errorCallback, insertDocument);
};

module.exports.getById = function(id, collectionName, successCallback, errorCallback){
    callCollectionFunctionWithSingleInput(id, collectionName, successCallback, errorCallback, findDocumentById);
};

module.exports.getAll = function(collectionName, successCallback, errorCallback){
    callCollectionFunctionWithSingleInput(null, collectionName, successCallback, errorCallback, getAllDocumentsInCollection);
};

var insertDocument = function(object, collectionName, db, successCallback, errorCallback) {
    db.collection(collectionName).insertOne(object, function(err) {
        buildAndSendSingleResponse(err, object, successCallback, errorCallback);
    });
};

var findDocumentById = function(id, collectionName, db, successCallback, errorCallback) {
    db.collection(collectionName).findOne({"_id":ObjectID(id)}, function(err, res){
        buildAndSendSingleResponse(err, res, successCallback, errorCallback);
    });
};

var getAllDocumentsInCollection = function(collectionName, db, successCallback, errorCallback){
    db.collection(collectionName).find({}, function(err, cursor){
        var items = []
        cursor.toArray(function(err, responses){
            for(var current in responses){
                checkError(err, errorCallback);
                var id = responses[current]._id;
                delete responses[current]['_id'];
                items.push({"id":id,"body":responses[current]});
            }
            successCallback(items);
        });
    });
}

var callCollectionFunctionWithSingleInput = function(object, collectionName, successCallback, errorCallback, method){
    MongoClient.connect(url, function(err, db) {
        checkError(err, errorCallback);
        if(object == null){
            method(collectionName ,db,
                function(response) {
                    db.close();
                    successCallback(response);
                },
                errorCallback
            );
        } else {
            method(object, collectionName, db,
                function (response) {
                    db.close();
                    successCallback(response);
                },
                errorCallback
            );
        }
    });
}

var buildAndSendSingleResponse= function(err, response, successCallback, errorCallback){
        checkError(err, errorCallback);
        var id = response._id;
        delete response['_id'];
        successCallback({"id":id,"body":response});
}

var checkError = function(err, callback){
    if(err){
        callback(err);
    }
};

