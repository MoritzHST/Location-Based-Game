const assert = require('assert');
const operations = require('./operations');
const logging = require('./logging');
const collections = require('./collections');
var sleep = require('system-sleep');

let isReady = false;
//10x versuchen mit der MongoDB zu verbinden
//In 5 Sekunden Interalle unterteilt
for (let i = 0; i < 10; i++) {
    if (!isReady) {
        logging.Info("Trying to connect to MongoDB");
        operations.isReady(function (pErr) {
            if (!pErr) {
                isReady = true;
            }
        });
        logging.Error("Could not connect to MongoDB, retrying in 5 seconds");
        sleep(5000);
    }
    else {
        break;
    }
}

if (isReady) {
    for (var collection in collections) {
        var name = collections[collection];
        operations.createCollection(name, function (err, db) {
            if (!err) {
                logging.Info(db.s.name + " erfolgreich erstellt");
            }
            else {
                logging.Error(err);
            }
        });
    }
}
else {
    logging.Error("MongoDB did not response");
    throw err;
}