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

for (var name in dbNames) {
    if (dbNames.hasOwnProperty(name)) {
        operations.createCollection(dbNames[name], function (err, result) {
            if (!err)
                logging.Info(dbNames[name] + " erfolgreich erstellt");
            else
                logging.Error(err);
        });
    }
}