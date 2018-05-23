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

async function insertIntoDb(collection, object) {
    //Objekt wird eingefügt/ersetzt
    return new Promise(
        resolve => {
            operations.updateObject(collection, object, object, function (err, result) {
                if (!err) {
                    logging.Info(collection + " erstellt: " + result.value._id);
                    resolve(result.value);
                }
                else {
                    logging.Error(err);
                    resolve(err);
                }
            });
        });
}

/**
 * Durchläuft die Datenmap und erstellt diejenigen Datensätze in der DB, die noch nicht existieren
 */
async function insertIntoDatabase() {
    for (let collection of dbObjects.keys()) {
        let objects = dbObjects.get(collection);
        for (let object in objects) {
            if (objects.hasOwnProperty(object)) {
                let result = await insertIntoDb(collection, objects[object]);
                if (result._id) {
                    objects[object]._id = result._id;
                }
            }
        }
    }
}

if (process.env.env === "development") {
    //Lösche die Collections
    clearCollections();
    //Funktionsaufruf für das File
    insertIntoDatabase();
}