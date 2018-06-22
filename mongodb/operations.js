/**
 * http://usejsdoc.org/
 */

const assert = require('assert');
const logging = require('../helper/logging');
const mongo = require('./mongo');
const handler = require('./handler');

module.exports = {

    /***************************************************************************
     * Misc Operations
     **************************************************************************/

    /**
     * Generiert ein Sessiontoken
     */
    generateToken: function () {
        logging.Entering("generateToken");
        let returnObj = String(Math.floor(Math.random() * 10000)).padStart(4, "0");
        logging.Info("Token " + returnObj + " generated");
        logging.Leaving("generateToken");
        return logging.ReturnValue(returnObj);
    },

    /***************************************************************************
     * Object Operations
     **************************************************************************/

    /**
     * Objekt in der Datenbank und gibt dieses im Erfolgsfall zurück. Wurde kein
     * Objekt übergeben, werden Alle Objekte der Collection zurückgegeben.
     * pCollection --> pObject --> pCallback -->
     */
    findObject: function (pCollection, pObject, pCallback) {
        logging.Entering("findObject");
        logging.Parameter("pCollection", pCollection);
        logging.Parameter("pObject", pObject);
        return new Promise(resolve => {
            let database = mongo.Object();
            database.Client.connect(database.Url, function (error, result) {
                if (error) {
                    pCallback(error, null);
                } else {
                    if (pObject) {
                        result.db(database.Database).collection(pCollection).findOne(handler.idFriendlyQuery(pObject), function (err, db) {
                            result.close();
                            if (pCallback)
                                pCallback(err, db);
                            resolve(db);
                        });
                    } else {
                        result.db(database.Database).collection(pCollection).find({}).toArray(function (err, db) {
                            result.close();
                            if (pCallback)
                                pCallback(err, db);
                            resolve(db);
                        });
                    }
                }
            });
            logging.Leaving("findObject");
        });
    },

    /**
     * --- pCollection --> pObject -->
     */
    updateObject: function (pCollection, pObject, pQuery, pCallback) {
        logging.Entering("updateObject");
        logging.Parameter("pCollection", pCollection);
        logging.Parameter("pObject", pObject);
        logging.Parameter("pQuery", pQuery);
        return new Promise(resolve => {
            let database = mongo.Object();
            database.Client.connect(database.Url, function (error, result) {
                if (error) {
                    pCallback(error, null);
                    resolve(null);
                } else {
                    let friendlyObject = handler.idFriendlyQuery(pObject);

                    if (pQuery) {
                        result.db(database.Database).collection(pCollection).update(friendlyObject, {'$set': pQuery}, {upsert: true}, function (err, db) {
                            result.close();
                            if (pCallback)
                                pCallback(err, db);
                            resolve(db);
                        });
                    } else {
                        result.db(database.Database).collection(pCollection).insert(friendlyObject, function (err, db) {
                            result.close();
                            if (pCallback)                            
                                pCallback(err, db);
                            resolve(db);
                        });
                    }
                    /*
                     * result.db(database.Database).collection(pCollection).findAndModify(friendlyObject,
                     * [['_id', 'asc']], {'$set': (pQuery ? pQuery :
                     * friendlyObject)}, { new: true, upsert: true }, function
                     * (err, db) { result.close(); pCallback(err, db);
                     * resolve(db); });
                     */
                }
            });
            logging.Leaving("updateObject");
        });
    },

    updateObjects: function (pCollection, pSelector, pUpdate, pCallback) {
        logging.Entering("updateObjects");
        logging.Parameter("pCollection", pCollection);
        logging.Parameter("pObject", pSelector);
        logging.Parameter("pQuery", pUpdate);
        return new Promise(resolve => {
            let database = mongo.Object();
            database.Client.connect(database.Url, function (error, result) {
                if (error) {
                    pCallback(error, null);
                    resolve(null);
                } else {
                    let friendlySelector = handler.idFriendlyQuery(pSelector);
                    let friendlyUpdate = handler.idFriendlyQuery(pUpdate);
                    result.db(database.Database).collection(pCollection).update(friendlySelector, friendlyUpdate, {
                        multi: true
                    }, function (err, db) {
                        result.close();
                        pCallback(err, db);
                        resolve(db);
                    });
                }
            });
            logging.Leaving("updateObjects");
        });
    },

    /**
     * Entfernt Objekt aus der Collection pCollection return true, wenn löschen
     * erfolgreich false, wenn löschen nicht erfolgreich
     */
    deleteObjects: function (pCollection, pObjects, pCallback) {
        logging.Entering("deleteObjects");
        logging.Parameter("pCollection", pCollection);
        logging.Parameter("pObjects", pObjects);
        return new Promise(resolve => {
            let database = mongo.Object();
            database.Client.connect(database.Url, function (error, result) {
                if (error) {
                    pCallback(error, null);
                    resolve(null);
                } else {
                    result.db(database.Database).collection(pCollection).deleteMany(handler.idFriendlyQuery(pObjects), function (err, db) {
                        result.close();
                        pCallback(err, db);
                        resolve(db);
                    });
                }
            });
            logging.Leaving("deleteObjects");
        });
    },

    /***************************************************************************
     * Collection Operations
     **************************************************************************/

    /**
     * Erstellt eine Collection die der Datenbank zugefügt wird. pCollection ->
     * Name der neuen Datenbank-Collection
     */
    createCollection: function (pCollection, pCallback) {
        logging.Entering("createCollection");
        logging.Parameter("pCollection", pCollection);
        return new Promise(resolve => {
            let database = mongo.Object();
            database.Client.connect(database.Url, function (error, result) {
                if (error) {
                    pCallback(error, null);
                    resolve(null);
                } else {
                    result.db(database.Database).createCollection(pCollection, function (err, db) {
                        result.close();
                        pCallback(err, db);
                        resolve(db);
                    });
                }
            });
            logging.Leaving("createCollection");
        });
    },

    /**
     * Sucht nach einer bestimmten collection und gibt diese im Erfolgsfall
     * zurück. Wurde keine Identifizierung übergeben, so werden alle verfügbaren
     * Collections zurückgegeben. pCollection --> pCallback -->
     */
    getCollection: function (pCollection, pCallback) {
        logging.Entering("getCollection");
        logging.Parameter("pCollection", pCollection);
        return new Promise(resolve => {
            let database = mongo.Object();
            if (pCollection) {
                database.Client.connect(database.Url, function (error, result) {
                    if (error) {
                        pCallback(error, null);
                        resolve(null);
                    } else {
                        result.db(database.Database).collection(pCollection).find({}).toArray(function (err, db) {
                            result.close();
                            pCallback(err, db);
                            resolve(db);
                        });
                    }
                });
            } else {
                database.Client.connect(database.Url, function (error, result) {
                    if (error) {
                        pCallback(error, null);
                        resolve(null);
                    } else {
                        result.db(database.Database).listCollections().toArray(function (err, db) {
                            result.close();
                            pCallback(err, db);
                            resolve(db);
                        });
                    }
                });
            }
            logging.Leaving("getCollection");
        });
    },

    /**
     * Entfernt eine übergebene Collection aus der Datenbank pCollection -> Name
     * der zu löschenden Datenbank pCallback -->
     */
    dropCollection: function (pCollection, pCallback) {
        logging.Entering("dropCollection");
        logging.Parameter("pCollection", pCollection);
        let database = mongo.Object();
        database.Client.connect(database.Url, function (error, result) {
            if (error) {
                pCallback(error, null);
            } else {
                result.db(database.Database).collection(pCollection).drop(function (err, db) {
                    result.close();
                    pCallback(err, db);
                });
            }
        });
        logging.Leaving("dropCollection");
    },

    isReady: function (pCallback) {
        logging.Entering("isReady");
        return new Promise(resolve => {
            const database = mongo.Object();
            logging.Info("Connecting to " + database.Url + "...");
            database.Client.connect(database.Url, function (error) {
                if (pCallback)
                    pCallback(error);
                resolve(!error);
            });
            logging.Leaving("isReady");
        });
    }
};