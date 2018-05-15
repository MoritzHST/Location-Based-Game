const objects = require('../mongodb/objects');
const operations = require('../mongodb/operations');
const logging = require('../mongodb/logging');
const collections = require('../mongodb/collections');


let exampleLocation1 = new objects.Location("103a", "http://qr.service.fh-stralsund.de/h4r314");
exampleLocation1._id = "zzzzzzzzzzzz";

let exampleLocation2 = new objects.Location("323", "http://qr.service.fh-stralsund.de/h4r323");
exampleLocation2._id = "yyyyyyyyyyyy";


module.exports = {
    exampleLocation: exampleLocation1,
    exampleLocation2: exampleLocation2
};

/**
 * @param err
 * @param result
 * @returns
 */
operations.updateObject(collections.LOCATIONS, exampleLocation1, null, function (err, result) {
    if (!err)
        logging.Info("Location erstellt: " + result.value.identifier);
    else
        logging.Error(err);
});
operations.updateObject(collections.LOCATIONS, exampleLocation2, null, function (err, result) {
    if (!err)
        logging.Info("Location erstellt: " + result.value.identifier);
    else
        logging.Error(err);
});