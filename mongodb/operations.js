/**
 * http://usejsdoc.org/
 */

const assert = require('assert');
const logging = require('./logging');
const mongo = require('./mongo');

module.exports = {

    /**********************************************
     * Misc Operations
     **********************************************/

    /**
     * Generiert ein Sessiontoken
     */
    generateToken: function () {
        var returnObj = String(Math.floor(Math.random() * 10000)).padStart(4, "0");
        //var returnObj = ("0000" + Math.floor(Math.random() * 10000)).slice(-4);
        logging.Info("Token " + returnObj + " generated");
        return returnObj;
    },

    /**********************************************
     * Object Operations
     **********************************************/

    /**
     * sucht nach einem Objekt in der Datenbank und gibt dieses im Erfolgsfall zurück
     * pCollection -->
     * pObject -->
     * pCallback -->
     */
    findObject: function (pCollection, pObject, pCallback) {
    	mongo.call(function(dbo, db) {
            dbo.collection(pCollection).findOne(pObject, function (err, result) {
                db.close();
                pCallback(result);
            });
    	}, 'findObject')
    },

    findAllObjects: function (pCollection, pCallback) {
    	mongo.call(function(dbo, db) {
    		dbo.collection(pCollection).find({}).toArray(function (err, result) {
                db.close();
                pCallback(result);
            });
    	}, 'findAllObjects') 	
    },


    /**
     * ---
     * pCollection -->
     * pObject -->
     */
    updateObject: function (pCollection, pObject, pQuery, pCallback) {
    	mongo.call(function(dbo, db) {
            dbo.collection(pCollection).findAndModify(pObject, [['_id', 'asc']],
                    {'$set': ((pQuery) ? pQuery : pObject)}, {new: true, upsert: true}, function (err, result) {
                        db.close();
                        pCallback(result);
            });
    	}, 'updateObject')
    },

    /**
     * Entfernt Objekt aus der Collection pCollection
     *
     * return true, wenn löschen erfolgreich
     *        false, wenn löschen nicht erfolgreich
     */
    deleteObjects: function (pCollection, pObjects, pCallback) {
    	mongo.call(function(dbo, db) {
            dbo.collection(pCollection).deleteMany(pObjects, function (err, object) {
                db.close();
                pCallback(object.result);
            });
    	}, 'deleteObjects')    	
    },

    /**********************************************
     * Collection Operations
     **********************************************/

    /**
     * Erstellt eine Collection die der Datenbank zugefügt wird.
     *
     * pCollection -> Name der neuen Datenbank-Collection
     */
    createCollection: function (pCollection, pCallback) {
    	mongo.call(function(dbo, db) {
            dbo.createCollection(pCollection, function (err, result) {
                db.close();
                pCallback(pCollection, result);
            });
    	}, 'createCollection')      	
    },

    /**
     * Sucht nach einer bestimmten collection und gibt diese im Erfolgsfall zurück.
     * Wurde keine Identifizierung übergeben, so werden alle verfügbaren Collections zurückgegeben.
     * pCollection -->
     * pCallback -->
     */
    getCollection: function (pCollection, pCallback) {
    	if (pCollection) {
        	mongo.call(function(dbo, db) {
                dbo.collection(pCollection).find({}).toArray(function (err, result) {
                    db.close();
                    pCallback(result);
            	});
        	}, 'getCollection (' + pCollection + ')')	
    	} else {
        	mongo.call(function(dbo, db) {
                dbo.listCollections().toArray(function (err, result) {
                    db.close();
                    pCallback(result);
                });
        	}, 'getCollection (ALL)')		
    	}
    },

    /**
     * Entfernt eine übergebene Collection aus der Datenbank
     *
     * pCollection -> Name der zu löschenden Datenbank
     * pCallback -->
     */
    dropCollection: function (pCollection, pCallback) {
    	mongo.call(function(dbo, db) {
            dbo.collection(pCollection).drop(function (err, success) {
                db.close();
                pCallback(success);
            });
    	}, 'dropCollection (' + pCollection + ')')	    	
    }
}