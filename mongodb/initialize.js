const assert = require('assert');
const operations = require('./operations');
const logging = require('../helper/logging');
const collections = require('./collections');
const sleep = require('system-sleep');
const conf = require('./mongo').Conf;

let isReady = false;
let iterator = 0;
// 10x versuchen mit der MongoDB zu verbinden
// In 5 Sekunden Interalle unterteilt
while (isReady === false && iterator < conf.connectionAttempts) {
    logging.Info("Trying to connect to MongoDB");
    operations.isReady()
        .then(function (pObj) {
            if (pObj) {
                isReady = true;
                logging.Info("Connection successful");
                for (var collection in collections) {
                    var name = collections[collection];
                    operations.createCollection(name, function (err, db) {
                        if (!err) {
                            logging.Info(db.s.name + " erfolgreich erstellt");
                        } else {
                            logging.Error(err);
                        }
                    });
                }
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