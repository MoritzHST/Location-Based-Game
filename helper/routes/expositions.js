const operations = require('../../mongodb/operations');
const handler = require('../../mongodb/handler');
const ObjectID = require('mongodb').ObjectID;
const logging = require('../logging');
const expositionCollection = require('../../mongodb/collections').EXPOSITIONS;

const eventCollection = require('../../mongodb/collections').EVENTS;

function findExpositions(req, res) {
    logging.Entering("GET /find/expositions");
    logging.Parameter("request.query", req.query);
    operations.findObject(expositionCollection, (handler.checkIfValidQuery(req.query) ? req.query : null), function (err, item) {
        handler.dbResult(err, res, item, "Das Item " + JSON.stringify(req.query).replace(/\"/g, '') + " existiert nicht.");
    });
    logging.Leaving("GET /find/expositions");
}

function insertExposition(req, res) {
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
}

function updateExposition(req, res) {
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
                console.log(req.params);
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
}

function deleteExposition(req, res) {
    logging.Entering("POST /delete/expositions");

    req.query = handler.getRealRequest(req.query, req.body);

    logging.Parameter("request.query", req.query);

    if (handler.checkIfValidQuery(req.query)) {
        operations.deleteObjects(expositionCollection, req.query, function (err, item) {
            if (!err) {
                operations.updateObjects(eventCollection, {"locationMappings.exposition._id": new ObjectID(req.query._id)}, {
                    $pull: {
                        "locationMappings": {"exposition._id": new ObjectID(req.query._id)}
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
}

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

module.exports = {
    findExpositions,
    insertExposition,
    updateExposition,
    deleteExposition
};