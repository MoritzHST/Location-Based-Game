const operations = require('../mongodb/operations');
const handler = require('../mongodb/handler');
const router = require('express').Router();

const locationMappingCollection = require('../mongodb/collections').LOCATION_MAPPING;

const locationNotFoundMessage = "Zu diesem Code konnten leider keine Minispiele gefunden werden. Tut uns Leid. Really, we are sorry :(";

/* Global */

/* GET */
/* Find ScanResult(s) */
router.get('/find/scan', function (req, res) {
    let identifier = req.query.identifier;

    operations.findObject(locationMappingCollection,
        {
            "location.identifier": identifier
        }, function (err, item) {

            if (item == null) {
                res.status(422).jsonp({
                    "error": locationNotFoundMessage
                });
            } else {
                handler.dbResult(err, res, item, locationNotFoundMessage);
                item.games.forEach(function (game) {
                    game.answers.forEach(function (answer) {
                        answer.isCorrect = undefined;
                    });
                });
            }
        });
});

module.exports = router;