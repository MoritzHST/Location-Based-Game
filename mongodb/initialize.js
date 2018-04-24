const assert = require('assert');
const operations = require('./operations');
const logging = require('./logging');

var dbNames = [
    "minigames_rooms",
    "rooms",
    "users",
    "minigames",
    "users_rooms",
    "templates"
];

for (var name in dbNames) {
    if (dbNames.hasOwnProperty(name)) {
        operations.createCollection(dbNames[name], function (err) {
            if (!err) {
                logging.Info(dbNames[name] + " erfolgreich erstellt");
            }
            else {
                logging.Error(err);
            }
        });
    }
}