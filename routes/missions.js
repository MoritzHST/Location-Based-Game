const operations = require('../mongodb/operations');
const handler = require('../mongodb/handler');
const router = require('express').Router();

const locationMappingCollection = require('../mongodb/collections').LOCATION_MAPPING;
const userCollection = require('../mongodb/collections').USERS;

const errorMessage = "Fehler beim auslesen der Missionsübersicht";

/* Global */

/**
 * gibt alle dem Nutzer zur Verfügung stehenden Missionen zurück
 *
 */
router.get('/find/missions', function (req, res) {
    operations.findObject(locationMappingCollection,
        null, function (err, item) {
            operations.findObject(userCollection,
                req.session.user, function (userErr, user) {
                    if (!item) {
                        res.status(422).jsonp({
                            "error": errorMessage
                        });
                    } else {
                        if (!Array.isArray(item)) {
                            item = new Array(item);
                        }

                        //Die einzelnen Labore flaggen
                        for (let i in user.visits) {
                            item.forEach(function (mission) {
                                mission.games = undefined;
                                if (user.visits.hasOwnProperty(i) && user.visits[i].location._id.toString() === mission.location._id.toString()) {
                                    mission.state = user.visits[i].state;
                                }
                            });
                        }
                        console.log(item);
                        handler.dbResult(err, res, item, errorMessage);
                    }
                });
        });
});

module.exports = router;