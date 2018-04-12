/**
 * http://usejsdoc.org/
 */

const assert = require('assert');
const logging = require('./logging');
const mongo = require('./mongo');
const handler = require('./handler');

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
     * ToDo: bei pObject prüfen, ob es sich um eine _id handelt
     * 
     * sucht nach einem Objekt in der Datenbank und gibt dieses im Erfolgsfall zurück.
     * Wurde kein Objekt übergeben, werden Alle Objekte der Collection zurückgegeben.
     * pCollection -->
     * pObject -->
     * pCallback -->
     */
    findObject: function (pCollection, pObject, pCallback) {
    	var database = mongo.Object();
    	database.Client.connect(database.Url, function(error, result) {
    		if (error) {
    			pCallback(error, null)
    		} else {
    			if (pObject) {
		    		result.db(database.Database).collection(pCollection).findOne(handler.idFriendlyQuery(pObject), function (err, db) {
		    			result.close();
		                pCallback(err, db);
		            });     
    			} else {
    	    		result.db(database.Database).collection(pCollection).find({}).toArray(function (err, db) {
    	    			result.close();
    	                pCallback(err, db);
    	            });       				
    			}
    		}
    	});    	
    },

    /**
     * ---
     * pCollection -->
     * pObject -->
     */
    updateObject: function (pCollection, pObject, pQuery, pCallback) {
    	var database = mongo.Object();
    	database.Client.connect(database.Url, function(error, result) {
    		if (error) {
    			pCallback(error, null)
    		} else {    		
    			var friendlyObject = handler.idFriendlyQuery(pObject);
	    		result.db(database.Database).collection(pCollection).findAndModify(friendlyObject, [['_id', 'asc']],
	                    {'$set': ((pQuery) ? pQuery : friendlyObject)}, {new: true, upsert: true}, function (err, db) {
	                result.close();
	                pCallback(err, db);
	            });    
    		}
    	});
    },

    /**
     * Entfernt Objekt aus der Collection pCollection
     *
     * return true, wenn löschen erfolgreich
     *        false, wenn löschen nicht erfolgreich
     */
    deleteObjects: function (pCollection, pObjects, pCallback) {
    	var database = mongo.Object();
    	database.Client.connect(database.Url, function(error, result) {
    		if (error) {
    			pCallback(error, null)
    		} else {    		
	    		result.db(database.Database).collection(pCollection).deleteMany(handler.idFriendlyQuery(pObjects), function (err, db) {
	    			result.close();
	                pCallback(err, db);
	            });       		
    		}
    	});
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
    	var database = mongo.Object();
    	database.Client.connect(database.Url, function(error, result) {    	
    		if (error) {
    			pCallback(error, null)
    		} else {    		
	    		result.db(database.Database).createCollection(pCollection, function (err, db) {
	    			result.close();
	                pCallback(err, db);
	            });
    		}
    	});
    },

    /**
     * Sucht nach einer bestimmten collection und gibt diese im Erfolgsfall zurück.
     * Wurde keine Identifizierung übergeben, so werden alle verfügbaren Collections zurückgegeben.
     * pCollection -->
     * pCallback -->
     */
    getCollection: function (pCollection, pCallback) {
    	var database = mongo.Object();    	
    	if (pCollection) {
        	database.Client.connect(database.Url, function(error, result) {
        		if (error) {
        			pCallback(error, null)
        		} else {        		
	        		result.db(database.Database).collection(pCollection).find({}).toArray(function (err, db) {
	        			result.close();
	                    pCallback(err, db);
	                });       		
        		}
        	});    		
    	} else {
        	database.Client.connect(database.Url, function(error, result) {
        		if (error) {
        			pCallback(error, null)
        		} else {        		
	        		result.db(database.Database).listCollections().toArray(function (err, db) {
	        			result.close();
	                    pCallback(err, db);
	                });  
        		}
        	});
    	}
    },

    /**
     * Entfernt eine übergebene Collection aus der Datenbank
     *
     * pCollection -> Name der zu löschenden Datenbank
     * pCallback -->
     */
    dropCollection: function (pCollection, pCallback) {
    	var database = mongo.Object();
    	database.Client.connect(database.Url, function(error, result) {
    		if (error) {
    			pCallback(error, null)
    		} else {    		
	    		result.db(database.Database).servercollection(pCollection).drop(function (err, db) {
	    			result.close();
	                pCallback(err, db);
	            });     
    		}
    	});
    }
}