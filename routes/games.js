const operations = require('../mongodb/operations');
const handler = require('../mongodb/handler');
const logging = require('../helper/logging');
const router = require('express').Router();

const gamesCollection = require('../mongodb/collections').GAMES;

/* Global */

/* GET */
/* Find games(s) */
router.get('/find/games', function(req, res) {
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
router.post('/insert/games', function(req, res) {
    logging.Entering("POST /insert/games");

    req.query["answers"] = handler.getRealRequest(req.query["answers"], req.body);

    logging.Parameter("request.query", req.query);

    if (handler.checkIfValidQuery(req.query)) {
        operations.updateObject(gamesCollection, req.query, null, function(err, item) {
            handler.dbResult(err, res, item, "Das Item " + JSON.stringify(req.query).replace(/\"/g, '') + " kann nicht hinzugefüt werden.");
        });
    } else {
        res.status(422).jsonp({
            "error" : "Die übergebenen Parameter sind ungültig"
        });
    }

    logging.Leaving("POST /insert/games");
});

/* Update games */
router.post('/update/games/:id', function(req, res) {
    logging.Entering("POST /update/games/:id");

    req.query["answers"] = handler.getRealRequest(req.query["answers"], req.body);

    logging.Parameter("request.query", req.query);

    if (handler.checkIfValidQuery(req.query)) {
        operations.updateObject(gamesCollection, handler.idFriendlyQuery({
            _id : req.params.id
        }), req.query, function(err, item) {
            if (!err && item.value) {
                operations.updateObject(eventCollection, {
                    "locationMappings": {
                        "$elemMatch": {
                            "games._id": new ObjectID(req.params.id)
                        }
                    }
                }, {
                    "locationMappings.$.games": item.value
                }, function (event_err, event_item) {
                    handler.dbResult(event_err, res, event_item, "Das Item " + item + " konnte nicht mit " + JSON.stringify(req.query).replace(/\"/g, '') + " geupdatet werden.");
                });
            } else {
                handler.dbResult(err, res, item, "Das Item " + req.params.id + " konnte nicht mit " + JSON.stringify(req.query).replace(/\"/g, '') + " geupdatet werden.");
            }
        });
    } else {
        res.status(422).jsonp({
            "error" : "Die übergebenen Parameter sind ungültig"
        });
    }

    logging.Leaving("POST /update/games/:id");
});

/* Delete games(s) */
router.post('/delete/games', function(req, res) {
    logging.Entering("POST /delete/games");

    req.query = handler.getRealRequest(req.query, req.body);

    logging.Parameter("request.query", req.query);

    if (handler.checkIfValidQuery(req.query)) {
        operations.deleteObjects(gamesCollection, req.query, function(err, item) {
            handler.dbResult(err, res, item, "Die Items mit den Eigenschaften " + JSON.stringify(req.query).replace(/\"/g, '') + " konnten nicht gelöscht werden.");
        });
    } else {
        res.status(422).jsonp({
            "error" : "Die übergebenen Parameter sind ungültig"
        });
    }

    logging.Leaving("POST /delete/games");
});

module.exports = router;