const operations = require('../mongodb/operations');
const handler = require('../mongodb/handler');
const router = require('express').Router();

const locationMappingCollection = require('../mongodb/collections').LOCATION_MAPPING;
const userCollection = require('../mongodb/collections').USERS;
const objects = require('../mongodb/objects');

const gameHelper = require('../helper/scan');

const invalidRequest = "Die Anfrage ist ungültig";

/* Global */

/**
 * Behandelt eine Scan-Anfrage.
 * Dabei wird überprüft ob zu diesem Event ein Minispiel für die angefragte Location freigeschaltet wurde.
 * Zudem wird geprüft, ob der user bereits an dieser Location war. Sollte dies nicht der Fall sien, wird ihm
 * das dem entsprechende Visit-Objekt angehangen.
 * Die Antwort entspricht einem leicht veränderten LocationMappingObjekt, an dem, eine der Fragestellung
 * entsprechende Anzahl an Antworten und Fragen, sowie bei noch nicht beantworteten Fragen,
 * den Antworten keinerlei Informationen über ihre Richtigkeit angehangen sind.
 */
router.get('/find/scan/:identifier', function (req, res) {
    req.query = handler.getRealRequest(req.query, req.body);

    let identifier = req.query.identifier;

    if (!handler.checkIfValidQuery(req)) {
        res.status(422).jsonp({
            "error": invalidRequest
        });
        return;
    }

    operations.findObject(locationMappingCollection,
        {
            "location.identifier": identifier
        }, function (err, item) {
            if (item) {
                item.games = gameHelper.prepareGames(item.games);

                operations.findObject(userCollection, req.session.user, function (userErr, userItem) {
                    if (!userErr && userItem) {
                        if (gameHelper.hasAlreadyVisited(userItem, item.location)) {
                            item.games = gameHelper.addGameStates(userItem.visits, item.games, item.location._id);
                        } else {
                            if (userItem.visits === undefined) {
                                userItem.visits = [];
                            }
                            userItem.visits.push(new objects.Visit(item, [], false, objects.RoomStates.VISITED));
                            operations.updateObject(userCollection,
                                handler.idFriendlyQuery({
                                    _id: userItem._id
                                }),
                                userItem, function () {
                                });
                        }
                    } else {
                        //behandle error
                    }
                });
            }
            handler.dbResult(err, res, item, "Zu diesem Code konnten leider keine Minispiele gefunden werden. Tut uns Leid. Really, we are sorry :(");
        });
});

module.exports = router;