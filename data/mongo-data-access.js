var Error = require('./../rest-api/error');
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var assert = require('assert');
var url = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/jzangari-tenable'

module.exports.save = function(object, collectionName, successCallback, errorCallback){
    callCollectionFunction([object], collectionName, successCallback, errorCallback, insertDocument);
};

module.exports.getById = function(id, collectionName, successCallback, errorCallback){
    callCollectionFunction([id], collectionName, successCallback, errorCallback, findDocumentById);
};

module.exports.getAll = function(collectionName, successCallback, errorCallback){
    callCollectionFunction([], collectionName, successCallback, errorCallback, getAllDocumentsInCollection);
};

module.exports.update = function(id, object, collectionName, successCallback, errorCallback){
    callCollectionFunction([id, object], collectionName, successCallback, errorCallback, updateDocument);
};

module.exports.delete = function(id, collectionName, successCallback, errorCallback){
    callCollectionFunction([id], collectionName, successCallback, errorCallback, deleteDocument);
};


module.exports.find = function(queryPararms, sortField, paginationData, collectionName, successCallback, errorCallback){
    callCollectionFunction([queryPararms, sortField, paginationData], collectionName, successCallback, errorCallback, findDocument);
};


var insertDocument = function(object, collectionName, db, successCallback, errorCallback) {
    db.collection(collectionName).insertOne(object, function(err) {
        buildAndSendSingleResponse(err, object, successCallback, errorCallback);
    });
};

var findDocumentById = function(id, collectionName, db, successCallback, errorCallback) {
    //Mongo freaks out if you try to create an ObjectID to search with that isn't the right size.
    var idSize = encodeURI(id).split(/%..|./).length - 1;
    if(idSize < 12){
        errorCallback(new Error(404, 'Not Found: ' + id + ' is an invalid identifier.'));
    }
    db.collection(collectionName).findOne({"_id":ObjectID(id)}, function(err, res){
        if(res == null || res == undefined){
            errorCallback(new Error(404, 'Not Found: ' + id ));
        } else {
            buildAndSendSingleResponse(err, res, successCallback, errorCallback);
        }
    });
};

var getAllDocumentsInCollection = function(collectionName, db, successCallback, errorCallback){
    db.collection(collectionName).find({}, function(err, cursor){
        var returnItems = []
        cursor.toArray(function(err, responses){
            //For each item delete the mongo and create a respone object to put into the return array.
            for(var current in responses){
                checkError(err, errorCallback);
                //Remove the MongoID from the document and create a response the Resource can map.
                var id =  responses[current]._id;
                delete responses[current]['_id'];
                returnItems.push({
                    "id":id,
                    "body":responses[current]
                });
            }
            successCallback(returnItems);
        });
    });
}

var updateDocument = function(id, object, collectionName, db, successCallback, errorCallback) {
    //Mongo freaks out if you try to create an ObjectID to search with that isn't the right size.
    var idSize = encodeURI(id).split(/%..|./).length - 1;
    try{
        var objectID = new ObjectID(id)
    } catch (err){
        console.log(err);
    }
    if(idSize < 12){
        errorCallback(new Error(404, 'Not Found: ' + id + ' is an invalid identifier.'));
    }
    //Set up updates object that mongo uses.
    var updates = {
        "$set":object
    };
    db.collection(collectionName).updateOne({"_id":objectID}, updates, function(err, res){
        if(res.modifiedCount == 1){
           successCallback();
        } else {
            errorCallback(new Error(404, 'Not Found: ' + id ));
        }
    });
};

var deleteDocument = function(id, collectionName, db, successCallback, errorCallback) {
    //Mongo freaks out if you try to create an ObjectID to search with that isn't the right size.
    var idSize = encodeURI(id).split(/%..|./).length - 1;
    if(idSize < 12){
        errorCallback(new Error(404, 'Not Found: ' + id + ' is an invalid identifier.'));
    }
    db.collection(collectionName).findOneAndDelete({"_id":ObjectID(id)}, function(err, res){
        if(!err){
            successCallback();
        } else {
            errorCallback(new Error(404, 'Not Found: ' + id ));
        }
    });
};


var findDocument = function(queryParams, sortField, paginationData, collectionName, db, successCallback, errorCallback) {
    db.collection(collectionName).find(queryParams, function(err, cursor){
        var returnItems = []
        if(sortField != undefined){
            var sortOrder = [[sortField,1]] ;
            cursor.sort(sortOrder);
        }
        if(paginationData != undefined) {
            cursor.skip(paginationData.pageNumber * paginationData.pageSize);
            cursor.limit(paginationData.pageSize);
        }
        cursor.toArray(function(err, responses){
            //For each item delete the mongo and create a response object to put into the return array.
            for(var current in responses){
                checkError(err, errorCallback);
                //Remove the MongoID from the document and create a response the Resource can map.\
                var id = responses[current]._id;
                delete responses[current]['_id'];
                returnItems.push({
                    "id":id,
                    "body":responses[current]
                });
            }
            successCallback(returnItems);
        });
    });
};

var callCollectionFunction = function(input, collectionName, successCallback, errorCallback, method){
    MongoClient.connect(url, function(err, db) {
        checkError(err, errorCallback);
        //If there is no object passed in, call the method without it.
        if(input == null || input.length == 0){
            method(collectionName ,db,
                function(response) {
                    db.close();
                    successCallback(response);
                },
                errorCallback
            );
        //Otherwise, call it with the object as the first argument.
        } else if(input.length == 1) {
            method(input[0], collectionName, db,
                function (response) {
                    db.close();
                    successCallback(response);
                },
                errorCallback
            );
        } else if(input.length == 2) {
            method(input[0], input[1], collectionName, db,
                function (response) {
                    db.close();
                    successCallback(response);
                },
                errorCallback
            );
        } else if(input.length == 3) {
            method(input[0], input[1], input[2], collectionName, db,
                function (response) {
                    db.close();
                    successCallback(response);
                },
                errorCallback
            );
        }
    });
}

var buildAndSendSingleResponse = function(err, response, successCallback, errorCallback){
        checkError(err, errorCallback);
        //Remove the MongoID from the document and create a response the Resource can map.
        var id = response._id;
        delete response['_id'];
        successCallback({
            "id":id,
            "body":response
        });
}

var checkError = function(err, callback){
    if(err){
        callback(new Error(500, JSON.stringify(err)));
    }
};

