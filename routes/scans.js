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
router.get('/find/scan', function (req, res) {
    req.query = handler.getRealRequest(req.query, req.body);

    let identifier = req.query.identifier;

    if (!handler.checkIfValidQuery(req.query) || !identifier) {
        res.status(422).jsonp({
            "error": invalidRequest
        });
        return;
    }

    operations.findObject(locationMappingCollection,
        {
            "location.identifier": identifier
        }, function (err, item) {
            //Es wurde ein Objekt gefunden -> also Zaubern
            if (item) {
                item.games = gameHelper.prepareGames(item.games);
                operations.findObject(userCollection, {_id: req.session.user._id}, function (userErr, userItem) {
                        item.games = gameHelper.addGameStates(userItem.visits, item.games, item.location._id);
                        if (!gameHelper.hasAlreadyVisited(userItem, item.location)) {
                            //Visits müssen initialisiert werden, wenn es sie noch nicht gibt
                            if (!userItem.visits) {
                                userItem.visits = [];
                            }
                            //Neuen Visit einf+gen, wenn der Raum noch nicht besucht ist
                            userItem.visits.push(new objects.Visit(item, [], false, objects.RoomStates.VISITED));
                            //Visit persistieren
                            operations.updateObject(userCollection,
                                {
                                    _id: userItem._id
                                },
                                userItem, function () {
                                });
                        }
                    handler.dbResult(err, res, item);
                    }
                );
            }
            //Es wurde kein Objekt zu dem Code gefunden
            else {
                res.status(422).jsonp({
                    error: "Zu diesem Code konnten leider keine Minispiele gefunden werden. Tut uns Leid. Really, we are sorry :("
                });
            }
        });
});

module.exports = router;