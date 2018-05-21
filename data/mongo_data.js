const operations = require('../mongodb/operations');
const logging = require('../helper/logging');
const dbObjects = require('./objects');

function clearCollections() {
    for (let collection of dbObjects.keys()) {
        operations.createCollection(collection, function (err, db) {
            if (!err) {
                logging.Info("Collection gelöscht: " + db);
            }
        });
    }
}

/**
 * Durchläuft die Datenmap und erstellt diejenigen Datensätze in der DB, die noch nicht existieren
 */
function insertIntoDatabase() {
    for (let collection of dbObjects.keys()) {
        let objects = dbObjects.get(collection);
        objects.forEach(function (object) {
                //Objekt wird eingefügt/ersetzt
            operations.updateObject(collection, object, object, function (err, result) {
                    if (!err) {
                        logging.Info(collection + " erstellt: " + result.value._id);
                        object._id = result.value._id;
                    }
                    else
                        logging.Error(err);
                });
            }
        );
    }
}

if (process.env.env === "development") {
    //Lösche die Collections
    clearCollections();
    //Funktionsaufruf für das File
    insertIntoDatabase();
}