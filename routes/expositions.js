const operations = require('../mongodb/operations');
const handler = require('../mongodb/handler');
const router = require('express').Router();
const ObjectID = require('mongodb').ObjectID;
const logging = require('../helper/logging');

const expositionCollection = require('../mongodb/collections').EXPOSITIONS;
const eventCollection = require('../mongodb/collections').EVENTS;


/* Global */

/* GET */
/* Gibt eine oder alle Ausstellungen zurück */
router.get('/find/expositions', function (req, res) {
    logging.Entering("GET /find/expositions");
    logging.Parameter("request.query", req.query);
    operations.findObject(expositionCollection, (handler.checkIfValidQuery(req.query) ? req.query : null), function (err, item) {
        handler.dbResult(err, res, item, "Das Item " + JSON.stringify(req.query).replace(/\"/g, '') + " existiert nicht.");
    });
    logging.Leaving("GET /find/expositions");
});

/* POST */
/* Fügt eine Ausstellung der Datenbank hinzu */
router.post('/insert/expositions', function (req, res) {
    logging.Entering("POST /insert/expositions");
    req.query = handler.getRealRequest(req.query, req.body);
    logging.Parameter("request.query", req.query);

    if (handler.checkIfValidQuery(req.query)) {
        operations.updateObject(expositionCollection, req.query, null, function (err, item) {
            handler.dbResult(err, res, item, "Das Item " + JSON.stringify(req.query).replace(/\"/g, '') + " kann nicht hinzugefüt werden.");
        });
    } else {
        res.status(422).jsonp({
            "error": "Die übergebenen Parameter sind ungültig"
        });
    }
    logging.Leaving("GET /insert/expositions");
});

/* Aktualisiert eine Ausstellung mit einer bestimmten id */
router.post('/update/expositions/:id', function (req, res) {
    logging.Entering("POST /update/expositions/:id");
    req.query = handler.getRealRequest(req.query, req.body);
    logging.Parameter("request.query", req.query);

    if (handler.checkIfValidQuery(req.query)) {

        // prüfe, ob der eingegebene Name bereits verwendet wird.
        operations.findObject(expositionCollection, req.query, function (err, item) {
            if (item && item._id !== req.params.id) {
                res.status(422).jsonp("Es existiert bereits eine Ausstellung mit diesem Namen.");
            } else {
                // wenn alle tests bestanden wurden, versuche die
                // Ausstellungsinformationen zu updaten.

                operations.updateObject(expositionCollection, handler.idFriendlyQuery({
                    _id: req.params.id
                }), req.query, function (err, item) {
                    if (!err && item.value) {
                        operations.updateObjects(eventCollection, {"locationMappings.exposition._id": new ObjectID(req.params.id)}, {
                            $set: {
                                "locationMappings.$.exposition": item.value
                            }
                        }, function (event_err, event_item) {
                            handler.dbResult(event_err, res, event_item, "Das Item " + item + " konnte nicht mit " + JSON.stringify(req.query).replace(/\"/g, '') + " geupdatet werden.");
                        });
                    } else {
                        handler.dbResult(err, res, item, "Die Ausstellung " + req.params.id + " konnte nicht mit " + JSON.stringify(req.query).replace(/\"/g, '') + " geupdatet werden.");
                    }
                });
            }
        });
    } else {
        res.status(422).jsonp({
            "error": "Die übergebenen Parameter sind ungültig"
        });
    }

    logging.Leaving("POST /update/expositions/:id");
});

/* Löscht eine Ausstellung */
router.post('/delete/expositions', function (req, res) {
    logging.Entering("POST /delete/expositions");
    logging.Parameter("request.query", req.query);

    if (handler.checkIfValidQuery(req.query)) {
        operations.deleteObjects(expositionCollection, req.query, function (err, item) {
            if (!err) {
                operations.updateObjects(eventCollection, {"locationMappings.location._id": new ObjectID(req.query._id)}, {
                    $unset: {
                        "locationMappings.$.location": ""
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
    logging.Leaving("POST /delete/expositions");
});

function updateRoom(req, res) {
    logging.Entering("updateRoom");
    logging.Parameter("request.query", req.query);

    if (handler.checkIfValidQuery(req.query)) {
        operations.updateObject(expositionCollection, handler.idFriendlyQuery({
            _id: req.params.id
        }), req.query, function (err, item) {
            handler.dbResult(err, res, item, "Das Item " + req.params.id + " konnte nicht mit " + JSON.stringify(req.query).replace(/\"/g, '') + " geupdatet werden.");
        });
    } else {
        res.status(422).jsonp({
            "error": "Die übergebenen Parameter sind ungültig"
        });
    }
    logging.Leaving("updateRoom");
}

module.exports = router;