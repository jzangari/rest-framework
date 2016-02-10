var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/jzangari-tenable'

module.exports.save = function(object, collectionName, errorCallback, successCallback){
    MongoClient.connect(url, function(err, db) {
        checkError(err, errorCallback);
        insertDocument(object, collectionName ,db, errorCallback, function(response) {
            db.close();
            successCallback(response);
        });
    });
};

var insertDocument = function(object, collectionName, db, errorCallback, successCallback) {
    db.collection(collectionName).insertOne(object, function(err, result) {
        checkError(err, errorCallback);
        console.log("Inserted a document into the restaurants collection.");
        var id = object._id;
        delete object['_id'];
        successCallback({"id":id,"body":object});
    });
};

var checkError = function(err, callback){
    if(err){
        callback(err);
    }
};
