const objects = require('../mongodb/objects');
const operations = require('../mongodb/operations');
const logging = require('../mongodb/logging');
const collections = require('../mongodb/collections');

var exampleLocation = new objects.Location("103a", "h4r103a");

module.exports = exampleLocation;

/**
 * 
 * @param err
 * @param result
 * @returns
 */
operations.updateObject(collections.LOCATIONS, exampleLocation, null, function (err, result) {
    if (!err)
        logging.Info("Location erstellt: " + result.value.identifier);
    else
        logging.Error(err);
});