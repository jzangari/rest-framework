var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var assert = require('assert');
var url = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/jzangari-tenable'

module.exports.save = function(object, collectionName, successCallback, errorCallback){
    MongoClient.connect(url, function(err, db) {
        checkError(err, errorCallback);
        insertDocument(object, collectionName ,db,
            function(response) {
                db.close();
                successCallback(response);
            },
            errorCallback
        );
    });
};

module.exports.getById = function(id, collectionName, successCallback, errorCallback){
    MongoClient.connect(url, function(err, db) {
        checkError(err, errorCallback);
        findDocumentById(id, collectionName, db,
            function(response) {
                db.close();
                successCallback(response);
            },
            errorCallback
        );
    });
};

var insertDocument = function(object, collectionName, db, successCallback, errorCallback) {
    db.collection(collectionName).insertOne(object, function(err) {
        checkError(err, errorCallback);
        console.log("Inserted a document into the restaurants collection.");
        var id = object._id;
        delete object['_id'];
        successCallback({"id":id,"body":object});
    });
};

var findDocumentById = function(id, db, callback, successCallback, errorCallback) {
    db.collection('restaurants').find({"_id":ObjectID(id)}, function(err, result){
        if(err) errorCallback();
        successCallback(result);
    });
};

var checkError = function(err, callback){
    if(err){
        callback(err);
    }
};
