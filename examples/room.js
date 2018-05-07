const objects = require('../mongodb/objects');
const operations = require('../mongodb/operations');
const logging = require('../mongodb/logging');

var exampleRoom = new objects.Room("103a", "Multimedia-Labor", "Hier werden Multimedia-Projekte durchgeführt...");

module.exports = exampleRoom;

/**
 * 
 * @param err
 * @param result
 * @returns
 */
operations.updateObject("rooms", exampleRoom, null, function (err, result) {
    if (!err)
        logging.Info("Raum erstellt: " + result.value.name);
    else
        logging.Error(err);
});