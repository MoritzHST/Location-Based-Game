const assert = require('assert');
const operations = require('./operations');
const logging = require('../helper/logging');
const collections = require('./collections');
const sleep = require('system-sleep');
const conf = require('./mongo').Conf;

let isReady = false;
let iterator = 0;

function createCollectionsFromList(pCollection) {
    for (let collection in pCollection) {
        if (pCollection.hasOwnProperty(collection)) {
            let name = pCollection[collection];
            operations.createCollection(name, function (err, db) {
                if (!err) {
                    logging.Info(db.s.name + " erfolgreich erstellt");
                } else {
                    logging.Error(err);
                }
            });
        }
    }
}

// 10x versuchen mit der MongoDB zu verbinden
// In 5 Sekunden Interalle unterteilt
while (isReady === false && iterator < conf.connectionAttempts) {
    logging.Info("Trying to connect to MongoDB");
    operations.isReady()
        .then(function (pObj) {
            if (pObj) {
                isReady = true;
                logging.Info("Connection successful");

                createCollectionsFromList(collections);

                return;
            }
            logging.Error("Could not connect to MongoDB, retrying in 5 seconds");
        });
    if (!isReady)
        sleep(5000);

    iterator++;
}

if (!isReady) {
    logging.Error("Connection to MongoDB failed");
    throw err;
}