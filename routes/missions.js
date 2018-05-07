const operations = require('../mongodb/operations');
const handler = require('../mongodb/handler');
const router = require('express').Router();

const locationMappingCollection = require('../mongodb/collections').LOCATION_MAPPING;

const errorMessage = "Fehler beim auslesen der Missionsübersicht";

/* Global */

/* GET */
/* Find ScanResult(s) */
router.get('/find/missions', function (req, res) {
    operations.findObject(locationMappingCollection,
        {}, function (err, item) {

            if (item == null) {
                res.status(422).jsonp({
                    "error": errorMessage
                });
            } else {
                if (Array.isArray(item)) {
                    item.forEach(function (mission) {
                        mission.games = undefined;
                    });
                } else {
                    item.games = undefined;
                }
                handler.dbResult(err, res, item, errorMessage);
            }
        });
});

module.exports = router;