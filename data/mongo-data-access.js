var Error = require('./../rest-api/error');
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var assert = require('assert');
var url = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/test'

module.exports.post = function(object, collectionName, callback){
    callHandlerFunction([object], collectionName, callback, insertDocument);
};

module.exports.getById = function(id, collectionName, callback){
    callHandlerFunction([id], collectionName, callback, findDocumentById);
};

module.exports.getAll = function(collectionName, callback){
    callHandlerFunction([], collectionName, callback, getAllDocumentsInCollection);
};

module.exports.put = function(id, object, collectionName, callback){
    callHandlerFunction([id, object], collectionName, callback, updateDocument);
};

module.exports.delete = function(id, collectionName, callback){
    callHandlerFunction([id], collectionName, callback, deleteDocument);
};


module.exports.find = function(queryPararms, sortField, paginationData, collectionName, callback){
    callHandlerFunction([queryPararms, sortField, paginationData], collectionName, callback, findDocument);
};


var insertDocument = function(object, collectionName, db, callback) {
    db.collection(collectionName).insertOne(object, function(err) {
        checkError(err, callback);
        buildAndSendSingleResponse(object, callback);
    });
};

var findDocumentById = function(id, collectionName, db, callback) {
     try {
        var objectId = ObjectID(id);
    } catch (err){
        console.log("Error while creating ObjectID:" +err);
        callback(new Error(400, 'The ID given was in valid or the request url info was bad.'))
    }
    db.collection(collectionName). find({"_id": {"$eq":objectId}}).limit(1).next(function(err, res){
        checkError(err, callback);
        if(res == null || res == undefined){
            callback(new Error(404, 'Not Found: ' + id ));
        } else {
            buildAndSendSingleResponse(res, callback);
        }
    });
};

var getAllDocumentsInCollection = function(collectionName, db, callback){
    db.collection(collectionName).find({}, function(err, cursor){
        var returnItems = []
        cursor.toArray(function(err, responses){
            checkError(err, callback);
            //For each item delete the mongo and create a respone object to put into the return array.
            for(var current in responses){
                //Remove the MongoID from the document and create a response the Resource can map.
                var id =  responses[current]._id;
                delete responses[current]['_id'];
                returnItems.push({
                    "id":id,
                    "body":responses[current]
                });
            }
            callback(null,returnItems);
        });
    });
}

var updateDocument = function(id, object, collectionName, db, callback) {
    try {
        var objectId = ObjectID(id);
    } catch (err){
        console.log("Error while creating ObjectID:" +err);
        callback(new Error(400, 'The ID given was in valid or the request url info was bad.'))
    }
    //Set up updates object that mongo uses.
    var updates = {
        "$set":object
    };
    db.collection(collectionName).updateOne({"_id":objectId}, updates, function(err, res){
       checkError(err, callback);
        if(res.modifiedCount == 1){
           callback();
        } else {
            callback(null, new Error(404, 'Not Found: ' + id ));
        }
    });
};

var deleteDocument = function(id, collectionName, db, callback) {
    try {
        var objectId = ObjectID(id);
    } catch (err){
        console.log("Error while creating ObjectID:" +err);
        callback(new Error(400, 'The ID given was in valid or the request url info was bad.'))
    }
    db.collection(collectionName).findOneAndDelete({"_id":objectId}, function(err, res){
        if(!err){
            callback();
        } else {
            callback(null, new Error(404, 'Not Found: ' + id ));
        }
    });
};


var findDocument = function(queryParams, sortField, paginationData, collectionName, db, callback) {
    db.collection(collectionName).find(queryParams, function(err, cursor){
        var returnItems = []
        if(sortField != undefined){
            var sortOrder = [[sortField,1]] ;
            cursor.sort(sortOrder);
        }
        if(paginationData != undefined) {
            if(paginationData.pageNumber > 1) {
                cursor.skip(paginationData.pageNumber * paginationData.pageSize);
            }
            cursor.limit(paginationData.pageSize);
        }
        cursor.toArray(function(err, responses){
            checkError(err, callback);
            //For each item delete the mongo and create a response object to put into the return array.
            for(var current in responses){
                //Remove the MongoID from the document and create a response the Resource can map.\
                var id = responses[current]._id;
                delete responses[current]['_id'];
                returnItems.push({
                    "id":id,
                    "body":responses[current]
                });
            }
            callback(null,returnItems);
        });
    });
};

var callHandlerFunction = function(input, collectionName, callback, method){
    MongoClient.connect(url, function(err, db) {
        checkError(err, callback);
        //If there is no object passed in, call the method without it.
        if(input == null || input.length == 0){
            method(collectionName ,db,
                function(err,response) {
                    db.close();
                    callback(err, response);
                }
            );
        //Otherwise, call it with the object as the first argument.
        } else if(input.length == 1) {
            method(input[0], collectionName, db,
                function (err, response) {
                    db.close();
                    callback(err, response);
                }
            );
        } else if(input.length == 2) {
            method(input[0], input[1], collectionName, db,
                function (err, response) {
                    db.close();
                    callback(err, response);
                }
            );
        } else if(input.length == 3) {
            method(input[0], input[1], input[2], collectionName, db,
                function (err, response) {
                    db.close();
                    callback(err, response);
                }
            );
        }
    });
}

var buildAndSendSingleResponse = function(response, callback){
        //Remove the MongoID from the document and create a response the Resource can map.
        var id = response._id;
        delete response['_id'];
        callback(null, {
            "id":id,
            "body":response
        });
}

var checkError = function(err, callback){
    if(err){
        var error = new Error(500, JSON.stringify(err))
        console.log(error);
        callback(error);
    }
};

