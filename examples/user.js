const objects = require('../mongodb/objects');
const operations = require('../mongodb/operations');
const logging = require('../mongodb/logging');
const collections = require('../mongodb/collections');

var exampleUser = new objects.User("Harald");
module.exports = exampleUser;

/**
 *
 * @param err
 * @returns
 */
operations.deleteObjects(collections.USERS, null, function (err) {
    if (!err)
        logging.Info("Alle Benutzer gelöscht.");
    else
        logging.Error(err);
});

/**
 * 
 * @returns
 */
setTimeout(function () {
    operations.updateObject(collections.USERS, exampleUser, null, function (err, result) {
        if (!err)
            logging.Info("Benutzer erstellt: " + result.value.name);
        else
            logging.Error(err);
    });
}, 2000);

/**
 * 
 * @param err
 * @param items
 * @returns
 */
operations.findObject("users", null, function (err, items) {
    if (!err)
        logging.Info("USERS: " + items);
    else
        logging.Error(err);
});

/**
 * 
 * @param err
 * @param item
 * @returns
 */
operations.findObject("users", exampleUser, function (err, item) {
    if (!err)
        logging.Info("USER: " + JSON.stringify(item));
    else
        logging.Error(err);
});