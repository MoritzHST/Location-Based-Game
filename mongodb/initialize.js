const assert = require('assert');
const operations = require('./operations');

var dbNames = [
    "minigames_rooms",
    "rooms",
    "users",
    "minigames",
    "templates"
];

for (var name in dbNames) {
    operations.createCollection(dbNames[name], function (objectName, result) {
        if (result)
            console.log(objectName + " erfolgreich erstellt");
        else
            console.log(objectName + " konnte nicht erstellt werden");
    });
}