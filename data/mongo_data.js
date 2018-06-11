const operations = require('../mongodb/operations');
const logging = require('../helper/logging');
const eventJSON = require('./data');
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
        operations.dropCollection(pCollection, function (err) {
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
    eventJSON.date = eventJSON.date ? eventJSON.date : String(new Date().toJSON().slice(0, 10));
    for (let locationMapping of eventJSON.locationMappings) {
        for (let game of locationMapping.games) {
            let gamesResult = await insertIntoDb(collections.GAMES, game);
            if (gamesResult._id) {
                game._id = gamesResult._id;
            }
        }
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
            locationMapping._id = locationMappingResult._id;
        }
    }
    await insertIntoDb(collections.EVENTS, eventJSON);
}

async function handleDebugObjects() {
    //Lösche die Collections
    await clearCollections();
    //Funktionsaufruf für das File
    //await insertIntoDatabase('example');
    await insertIntoDatabase();
}

if (process.env.env === "development") {
    handleDebugObjects();
}

module.exports = {
    insertData: async function (objectsFileName, pCallback) {
        await insertIntoDatabase();
        pCallback();
    },
    deleteData: async function (objectsFileName, pCallback) {
        await clearCollections();
        pCallback();
    }
};