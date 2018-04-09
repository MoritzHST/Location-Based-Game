const assert = require('assert');
const logging = require('./logging');
const mongo = require('./mongo');

module.exports = {

    /**
     * Generiert ein Sessiontoken.
     */
    generateToken: function () {
        var returnObj = String(Math.floor(Math.random() * 10000)).padStart(4, "0");
        //var returnObj = ("0000" + Math.floor(Math.random() * 10000)).slice(-4);
        logging.Info("Token " + returnObj + " generated");
        return returnObj;
    },


    /**********************************************
     * Collection Operations
     **********************************************/

    /**
     * Erstellt eine Collection die der Datenbank zugefügt wird.
     *
     * pCollection -> Name der neuen Datenbank-Collection
     */
    createCollection: function (pCollection) {
        return mongo.client.connect(mongo.url).then(function (db) {
            var result = db.db(mongo.database).createCollection(pCollection, function (err, result) {
                assert.equal(null, err);
                db.close();
                return err;
            });
        }).then(function (error) {
            if (!error)
                logging.Info(pCollection + " wurde erfolgreich erstellt");
            else
                logging.Error(pCollection + " konnte nicht erstellt werden");
            return error;
        });
    },

    /**
     * Gibt alle oder eine selbst gewählte Collection aus der Datenbank zurück.
     *
     * pCollection -> Name der zu suchenden Datenbank. Ist pCollection == null, werden alle Collections zurück gegeben.
     */
    getCollection: function (pCollection) {
        return mongo.client.connect(mongo.url).then(function (db) {
            var result;
            if (pCollection) {
                reult = db.db(mongo.database).collection(pCollection).find({}).toArray();
            } else {
                result = db.db(mongo.database).listCollections().toArray();
            }
            db.close();
            return result;
        }).then(function (items) {
            logging.Info(pCollection + " zurückgegeben");
            return items;
        });
    },

    /**
     * Entfernt eine übergebene Collection aus der Datenbank
     *
     * pCollection -> Name der zu löschenden Datenbank
     */
    dropCollection: function (pCollection) {
        return mongo.client.connect(mongo.url).then(function (db) {
            return db.db(mongo.database).collection(pCollection).drop(function (err, success) {
                assert.equal(null, err);
                db.close();
                return success;
            })
        }).then(function (success) {
            if (success)
                logging.Info(pCollection + " wurde erfolgreich gelöscht");
            else
                logging.Error(pCollection + " konnte nicht gelöscht werden");
            return success;
        });
    },

    /**********************************************
     * Object Operations
     **********************************************/

    /**
     * sucht nach einem Objekt in der Datenbank und gibt dieses im Erfolgfall zurück.
     * pCollection --> Datenbankname
     * pObject --> Identifier(s) des zu suchenden Objektes
     */
    findObject: function (pCollection, pObject) {
        return mongo.client.connect(mongo.url).then(function (db) {
            return db.db(mongo.database).collection(pCollection).findOne(pObject, function (err, result) {
                assert.equal(null, err);
                db.close();
                return result;
            })
        }).then(function (item) {
            logging.Info(item + " zurückgegeben");
            return item;
        });
    },

    /**
     * Fügt pObject in die Collection pCollection der MongoDB ein
     * pCollection --> Die Collection in der das neue Objekt eingefpgt werden soll
     * pObject --> Das einzutragene Objekt
     */
    insertObject: function (pCollection, pObject, pQuery) {

        return mongo.client.connect(mongo.url).then(function (db) {
            console.log("POBJECT: " + JSON.stringify((pQuery) ? pQuery : pObject));
            return db.db(mongo.database).collection(pCollection).findAndModify(pObject, [['_id', 'asc']],
                {'$setOnInsert': ((pQuery) ? pQuery : pObject)}, {new: true, upsert: true}, function (err, result) {
                    assert.equal(null, err);
                    logging.Info(JSON.stringify(result.value) + " ERFOLGREICH????");
                    db.close();
                    return result.value;
                })
        }).then(function (item) {
            logging.Info(item + " updated");
            return item;
        });
    },

    updateObject: function (pCollection, pKey, pObject) {
        //return obj;
    },

    /**
     * Entfernt Objekt aus der Collection pCollection
     *
     * return true, wenn löschen erfolgreich
     *        false, wenn löschen nicht erfolgreich
     */
    deleteObject: function (pCollection, pKey) {

    }
}