const operations = require('../mongodb/operations');
const handler = require('../mongodb/handler');
const router = require('express').Router();

const locationMappingCollection = require('../mongodb/collections').LOCATION_MAPPING;

/* Global */

/* GET */
/* Find ScanResult(s) */
router.get('/find/scan', function (req, res) {
    let identifier = req.query.identifier;
    operations.findObject(locationMappingCollection,
        {
            "location.identifier": identifier
        }, function (err, item) {
            handler.dbResult(err, res, item, "Zu diesem Code konnten leider keine Minispiele gefunden werden. Tut uns Leid. Really, we are sorry :(");
    });
});

module.exports = router;