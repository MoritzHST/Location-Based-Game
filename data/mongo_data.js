const operations = require('../mongodb/operations');
const logging = require('../helper/logging');
const dbObjectsJSON = require('./objectsjson');
const collections = require('../mongodb/collections');

async function clearCollections() {
    return new Promise(async resolve => {
        for (let collection in collections) {
            if (collections.hasOwnProperty(collection)) {
                await clearCollection(collections[collection]);
            }
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

async function insertIntoDatabase2() {
    dbObjectsJSON.events.forEach(async function (event) {
        event.locationMappings.forEach(async function (locationMapping) {
            locationMapping.games.forEach(async function (game) {
                let gamesResult = await insertIntoDb(collections.GAMES, game);
                if (gamesResult._id) {
                    game._id = gamesResult._id;
                }
            });
            let locationResult = await insertIntoDb(collections.LOCATIONS, locationMapping.location);
            if (locationResult._id) {
                locationMapping.location._id = locationResult._id;
            }

            let expositionResult = await insertIntoDb(collections.EXPOSITIONS, locationMapping.exposition);
            if (expositionResult._id) {
                locationMapping.exposition._id = expositionResult._id;
            }

            let locationMappingResult = await insertIntoDb(collections.LOCATION_MAPPING, locationMapping);
            if (locationMappingResult._id) {
                locationMappingResult.exposition._id = locationMappingResult._id;
            }
        });
        await insertIntoDb(collections.EVENTS, event);
    });
}

async function handleDebugObjects() {
    //Lösche die Collections
    await clearCollections();
    //Funktionsaufruf für das File
    //await insertIntoDatabase('example');
    await insertIntoDatabase2();
}

if (process.env.env === "development") {
    handleDebugObjects();
}

module.exports = {
    insertData: async function (objectsFileName, pCallback) {
        await insertIntoDatabase2();
        pCallback();
    },
    deleteData: async function (objectsFileName, pCallback) {
        await clearCollections(objectsFileName);
        pCallback();
    }
};