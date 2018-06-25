const operations = require('../../mongodb/operations');
const handler = require('../../mongodb/handler');
const atob = require("atob");
const logging = require('../logging');
const eventsCollection = require('../../mongodb/collections').EVENTS;

const userCollection = require('../../mongodb/collections').USERS;
const objects = require('../../mongodb/objects');
const gameHelper = require('../scanHelper');

const eventHelper = require('../eventHelper');
const invalidRequest = "Die Anfrage ist ungültig";

async function findScans(req, res) {
    logging.Entering("GET /find/scan");
    let currentEvent = await eventHelper.getCurrentEvent();
    if (!currentEvent) {
        res.status(422).jsonp({
            "error": eventHelper.noEventMessage
        });
        logging.Error("Aktuell findet kein Event statt");
        return;
    }

    req.query = handler.getRealRequest(req.query, req.body);
    logging.Parameter("request.query", req.query);

    let identifier = req.query.identifier;
    let userId;
    try {
        userId = req.session.user._id;
    } catch (e) {
        res.status(422).jsonp({
            error: "Du musst eingeloggt sein um diese Funktion zu nutzen"
        });
        return;
    }

    if (!handler.checkIfValidQuery(req.query) || !identifier) {
        res.status(422).jsonp({
            "error": invalidRequest
        });
        return;
    }

    identifier = atob(identifier);

    operations.findObject(eventsCollection,
        {
            "_id": currentEvent._id,
            "locationMappings": {"$elemMatch": {"location.identifier": identifier}}
        }, function (err, event) {
            //Es wurde ein Objekt gefunden -> also Zaubern
            if (event) {
                let item;
                event.locationMappings.forEach(function (mapping) {
                    if (mapping.location.identifier === identifier) {
                        item = mapping;
                    }
                });
                if (!item) {
                    res.status(422).jsonp({
                        error: "Hier ist heute leider nichts zu finden. Tut uns Leid. Really, we are sorry :("
                    });
                    return;
                }
                item.games = gameHelper.prepareGames(item.games);
                operations.findObject(userCollection, {_id: userId}, function (userErr, userItem) {
                        item.games = gameHelper.addGameStates(userItem.visits, item.games, item.location._id);
                        if (!gameHelper.hasAlreadyVisited(userItem, item.location)) {
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
    logging.Leaving("GET /find/scan");
}

module.exports = {
    findScans
};