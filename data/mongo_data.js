const operations = require('../mongodb/operations');
const logging = require('../helper/logging');
const dbObjects = require('./objects');

/**
 * fügt dem übergebenen Objekt eine zufällige GUID an, die in Mongo verwendet werden kann, und gibt das Objekt zurück
 * @param pObject Objekt, dem eine zufällige GUID angefügt werden soll
 * @returns {*} pObjekt mit angefügter GUID
 */
function addRandomGUID(pObject) {
    function getRandomId() {
        let id = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (let i = 0; i < 12; i++)
            id += possible.charAt(Math.floor(Math.random() * possible.length));

        return id;
    }

    pObject._id = getRandomId();
    return pObject;
}

/**
 * Durchläuft die Datenmap und erstellt diejenigen Datensätze in der DB, die noch nicht existieren
 */
function insertIntoDatabase() {
    for (let collection of dbObjects.keys()) {
        let objects = dbObjects.get(collection);
        objects.forEach(function (object) {
                //Objekt wird zunächst in der Datenbank gesucht
                operations.findObject(collection, object, function (err, item) {
                    //Ist das Objekt nicht vorhanden, wird es hinzugefügt
                    if (!item || err) {
                        object = addRandomGUID(object);
                        operations.updateObject(collection, object, null, function (err, result) {
                            if (!err)
                                logging.Info(collection + " erstellt: " + result.value._id);
                            else
                                logging.Error(err);
                        });
                    }
                });
            }
        );
    }
}

//Funktionsaufruf für das File
insertIntoDatabase();