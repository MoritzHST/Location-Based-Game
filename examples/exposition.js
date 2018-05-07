const objects = require('../mongodb/objects');
const operations = require('../mongodb/operations');
const logging = require('../mongodb/logging');
const collections = require('../mongodb/collections');

var exampleExposition = new objects.Exposition("Multimedia-Labor", "Hier werden Multimedia-Projekte durchgeführt...", undefined);

module.exports = exampleExposition;

/**
 *
 * @param err
 * @param result
 * @returns
 */
operations.updateObject(collections.EXPOSITIONS, exampleExposition, null, function (err, result) {
    if (!err)
        logging.Info("Ausstellung erstellt: " + result.value.name);
    else
        logging.Error(err);
});