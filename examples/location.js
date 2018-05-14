const objects = require('../mongodb/objects');
const operations = require('../mongodb/operations');
const logging = require('../mongodb/logging');
const collections = require('../mongodb/collections');

let exampleLocation = new objects.Location("103a", "http://qr.service.fh-stralsund.de/h4r314");
exampleLocation._id = "zzzzzzzzzzzz";

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