const assert = require('assert');
const operations = require('./operations');
const logging = require('./logging');

var dbNames = [
    "minigames_rooms",
    "rooms",
    "users",
    "minigames",
    "templates"
];

function onCreatedCollection(err, pDbObject) {
    if (!err) {
        logging.Info("Created Collection: " + pDbObject.s.name);
    }
    else {
        logging.Error(err);
    }
}

for (var name in dbNames) {
    if (dbNames.hasOwnProperty(name)) {
        operations.createCollection(dbNames[name], onCreatedCollection);
    }
}