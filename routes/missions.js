const operations = require('../mongodb/operations');
const handler = require('../mongodb/handler');
const router = require('express').Router();
const logging = require('../helper/logging');

const locationMappingCollection = require('../mongodb/collections').LOCATION_MAPPING;
const userCollection = require('../mongodb/collections').USERS;
const eventHelper = require('../helper/event');

const errorMessage = "Fehler beim auslesen der Missionsübersicht";

/* Global */

/**
 * gibt alle dem Nutzer zur Verfügung stehenden Missionen zurück
 *
 */
router.get('/find/missions', async function (req, res) {
    logging.Entering("POST /find/missions");

    let currentEvent = await eventHelper.getCurrentEvent();
    if (!currentEvent) {
        res.status(422).jsonp({
            "error": eventHelper.noEventMessage
        });
        logging.Error("Aktuell findet kein Event statt");
        return;
    }

    let userId;
    try {
        userId = req.session.user._id;
    } catch (e) {
        res.status(422).jsonp({
            error: "Du musst eingeloggt sein um diese Funktion zu nutzen"
        });
        return;
    }
    let item = currentEvent.locationMappings;
    operations.findObject(userCollection,
        {_id: userId}, function (userErr, user) {
            if (!item || !user) {
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
                handler.dbResult(userErr, res, item, errorMessage);
            }
        });

    logging.Leaving("POST /find/missions");
});

module.exports = router;