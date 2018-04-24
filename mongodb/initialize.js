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

function onCreatedCollection(err) {
    if (!err) {
        var collectionName = dbNames[name];
        logging.Info(collectionName + " erfolgreich erstellt");
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