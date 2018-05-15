const objects = require('../mongodb/objects');
const operations = require('../mongodb/operations');
const logging = require('../mongodb/logging');
const collections = require('../mongodb/collections');


let exampleExposition = new objects.Exposition("Multimedia-Labor", "Hier werden Multimedia-Projekte durchgeführt...", undefined);
let exampleExposition1 = new objects.Exposition("Labor-Nr2", "Hier könnte ein Text stehen...", undefined);


module.exports = {
    exampleExposition: exampleExposition,
    exampleExposition1: exampleExposition1
};

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
operations.updateObject(collections.EXPOSITIONS, exampleExposition1, null, function (err, result) {
    if (!err)
        logging.Info("Ausstellung erstellt: " + result.value.name);
    else
        logging.Error(err);
});