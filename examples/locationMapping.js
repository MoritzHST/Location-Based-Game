const objects = require('../mongodb/objects');
const operations = require('../mongodb/operations');
const logging = require('../mongodb/logging');

const collections = require('../mongodb/collections');

const exampleLocation = require('./location');
const exampleExposition = require('./exposition');
const exampleQuiz = require('./quiz');


let exampleLocationMapping = new objects.LocationMapping(exampleLocation.exampleLocation, exampleExposition.exampleExposition, exampleQuiz.exampleQuiz3);
let exampleLocationMapping2 = new objects.LocationMapping(exampleLocation.exampleLocation2, exampleExposition.exampleExposition1, exampleQuiz.exampleQuiz2);

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
operations.updateObject(collections.LOCATION_MAPPING, exampleLocationMapping2, null, function (err, result) {
    if (!err) {
        logging.Info("Mapping Location-Exposition-Minigames2 erstellt: " + result.value);
    }
    else
        logging.Error(err);
});