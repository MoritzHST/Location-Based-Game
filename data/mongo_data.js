const operations = require('../mongodb/operations');
const logging = require('../helper/logging');
const dbObjects = require('./objects');

async function clearCollections(objectsFileName) {
    return new Promise(async resolve => {
        for (let collection of dbObjects[objectsFileName]().keys()) {
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
async function insertIntoDatabase(objectsFileName) {
	let dataObjects = dbObjects[objectsFileName]();
    for (let collection of dataObjects.keys()) {
        let objects = dataObjects.get(collection);
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
    await clearCollections('example');
    //Funktionsaufruf für das File
    await insertIntoDatabase('example');
}

if (process.env.env === "development") {
    handleDebugObjects();
}

module.exports = {
  insertData: async function(objectsFileName, pCallback) {
	  await insertIntoDatabase(objectsFileName);
	  pCallback();
  },
  deleteData: async function(objectsFileName, pCallback) {
	  await clearCollections(objectsFileName);
	  pCallback();
  }
};