const operations = require('../mongodb/operations');
const handler = require('../mongodb/handler');
const logging = require('../helper/logging');
const router = require('express').Router();
const ObjectID = require('mongodb').ObjectID;

const gamesCollection = require('../mongodb/collections').GAMES;
const eventCollection = require('../mongodb/collections').EVENTS;


/* Global */

/* GET */
/* Find games(s) */
router.get('/find/games', function (req, res) {
    logging.Entering("GET /find/games");

    req.query = handler.getRealRequest(req.query, req.body);

    logging.Parameter("request.query", req.query);

    operations.findObject(gamesCollection, (handler.checkIfValidQuery(req.query) ? req.query : null), function (err, item) {
        handler.dbResult(err, res, item, "Das Item " + JSON.stringify(req.query).replace(/\"/g, '') + " existiert nicht.");
    });

    logging.Leaving("GET /find/games");
});

/* POST */
/* Insert games */
router.post('/insert/games', function (req, res) {
    logging.Entering("POST /insert/games");

    req.query = handler.getRealRequest(req.query, req.body);

    logging.Parameter("request.query", req.query);

    if (handler.checkIfValidQuery(req.query)) {
        operations.updateObject(gamesCollection, req.query, null, function (err, item) {
            handler.dbResult(err, res, item, "Das Item " + JSON.stringify(req.query).replace(/\"/g, '') + " kann nicht hinzugefüt werden.");
        });
    } else {
        res.status(422).jsonp({
            "error": "Die übergebenen Parameter sind ungültig"
        });
    }

    logging.Leaving("POST /insert/games");
});

/* Update games */
router.post('/update/games/:id', function (req, res) {
    logging.Entering("POST /update/games/:id");

    req.query = handler.getRealRequest(req.query, req.body);

    logging.Parameter("request.query", req.query);

    if (handler.checkIfValidQuery(req.query)) {
        operations.updateObject(gamesCollection, handler.idFriendlyQuery({
            _id: req.params.id
        }), req.query, function (err, item) {
            if (!err && item.value) {
                operations.findObject(eventCollection, {"locationMappings.games._id": new ObjectID(req.params.id)}, async function (err, events) {
                    let calls = [];
                    if (item && !events) {
                        res.status(200).jsonp({
                            message: "Spiel angepasst"
                        });
                        return;
                    }
                    else if (!events) {
                        res.status(422).jsonp({
                            error: "Ungültige Eingabe"
                        })
                    }
                    if (!(Array.isArray(events))) {
                        events = [events];
                    }
                    events.forEach(function (event) {
                        event.locationMappings.forEach(function (locationMapping) {
                            for (let i in locationMapping.games) {
                                if (locationMapping.games.hasOwnProperty(i) && locationMapping.games[i]._id.toString() === req.params.id.toString()) {
                                    locationMapping.games[i] = req.query;
                                    locationMapping.games[i]._id = req.params.id;
                                }
                            }
                        });
                        let asyncCall = operations.updateObject(eventCollection, {_id: new ObjectID(event._id)}, event, function (err, item) {
                        });
                        asyncCall.catch();
                        calls.push(asyncCall);
                    });
                    await Promise.all(calls);

                    handler.dbResult(err, res, events, "Das Item " + item + " konnte nicht mit " + JSON.stringify(req.query).replace(/\"/g, '') + " geupdatet werden.");
                });
            } else {
                handler.dbResult(err, res, item, "Das Item " + req.params.id + " konnte nicht mit " + JSON.stringify(req.query).replace(/\"/g, '') + " geupdatet werden.");
            }
        });
    } else {
        res.status(422).jsonp({
            "error": "Die übergebenen Parameter sind ungültig"
        });
    }

    logging.Leaving("POST /update/games/:id");
});

/* Delete games(s) */
router.post('/delete/games', function (req, res) {
    logging.Entering("POST /delete/games");

    req.query = handler.getRealRequest(req.query, req.body);

    logging.Parameter("request.query", req.query);

    if (handler.checkIfValidQuery(req.query)) {
        operations.deleteObjects(gamesCollection, req.query, function (err, item) {
            if (!err) {
                operations.updateObjects(eventCollection, {"locationMappings.games._id": new ObjectID(req.query._id)}, {
                    $pull: {
                        "locationMappings": {"games._id": new ObjectID(req.query._id)}
                    }
                }, function (event_err, event_item) {
                    handler.dbResult(event_err, res, event_item, "Das Item " + item + " konnte nicht mit " + JSON.stringify(req.query).replace(/\"/g, '') + " geupdatet werden.");
                });
            } else {
                handler.dbResult(err, res, item, "Das Item " + req.params.id + " konnte nicht mit " + JSON.stringify(req.query).replace(/\"/g, '') + " geupdatet werden.");
            }
        });
    } else {
        res.status(422).jsonp({
            "error": "Die übergebenen Parameter sind ungültig"
        });
    }

    logging.Leaving("POST /delete/games");
});

module.exports = router;