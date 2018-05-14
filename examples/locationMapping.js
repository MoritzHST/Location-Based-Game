const objects = require('../mongodb/objects');
const operations = require('../mongodb/operations');
const logging = require('../mongodb/logging');

const collections = require('../mongodb/collections');

const exampleLocation = require('./location');
const exampleExposition = require('./exposition');
const exampleQuiz = require('./quiz');


var exampleLocationMapping = new objects.LocationMapping(exampleLocation, exampleExposition, exampleQuiz);

module.exports = exampleLocationMapping;
/**
 *
 * @param err
 * @param res
 * @returns
 */
operations.updateObject(collections.LOCATION_MAPPING, exampleLocationMapping, null, function (err, result) {
    if (!err) {
        logging.Info("Mapping Location-Exposition-Minigames erstellt: " + result.value);
    }
    else
        logging.Error(err);
});