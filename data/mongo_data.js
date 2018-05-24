const operations = require('../mongodb/operations');
const logging = require('../helper/logging');
const dbObjects = require('./objects');

async function clearCollections() {
    return new Promise(async resolve => {
        for (let collection of dbObjects.keys()) {
            await clearCollection(collection);
        }
        resolve();
    });
}

function clearCollection(pCollection) {
    return new Promise(resolve => {
        operations.dropCollection(pCollection, function (err, db) {
            if (!err) {
                logging.Info("Collection gelöscht: " + pCollection);
                operations.createCollection(pCollection, function (err, db) {
                    if (!err) {
                        logging.Info("Collection erstellt: " + db.s.name);
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                });
            } else {
                resolve(false);
            }
        });
    });
}


function insertIntoDb(collection, object) {
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

async function handleDebugObjects() {
    //Lösche die Collections
    await clearCollections();
    //Funktionsaufruf für das File
    await insertIntoDatabase();
}

if (process.env.env === "development") {
    handleDebugObjects();
}