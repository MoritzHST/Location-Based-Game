const assert = require('assert');
const operations = require('./operations');
const logging = require('./logging');
const collections = require('./collections');

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