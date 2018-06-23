const operations = require('../../mongodb/operations');
const handler = require('../../mongodb/handler');
const ObjectID = require('mongodb').ObjectID;
const logging = require('../logging');
const locationCollection = require('../../mongodb/collections').LOCATIONS;

const eventCollection = require('../../mongodb/collections').EVENTS;

function findLocations(req, res) {
    logging.Entering("GET /find/locations");

    req.query = handler.getRealRequest(req.query, req.body);

    logging.Parameter("request.query", req.query);

    operations.findObject(locationCollection, (handler.checkIfValidQuery(req.query) ? req.query : null), function (err, item) {
        handler.dbResult(err, res, item, "Das Item " + JSON.stringify(req.query).replace(/\"/g, '') + " existiert nicht.");
    });

    logging.Leaving("GET /find/locations");
}

function insertLocations(req, res) {
    logging.Entering("POST /insert/locations");

    req.query = handler.getRealRequest(req.query, req.body);

    logging.Parameter("request.query", req.query);

    if (handler.checkIfValidQuery(req.query)) {
        operations.updateObject(locationCollection, req.query, null, function (err, item) {
            handler.dbResult(err, res, item, "Das Item " + JSON.stringify(req.query).replace(/\"/g, '') + " kann nicht hinzugefüt werden.");
        });
    } else {
        res.status(422).jsonp({
            "error": "Die übergebenen Parameter sind ungültig"
        });
    }

    logging.Leaving("POST /insert/locations");
}

function updateLocations(req, res) {
    logging.Entering("POST /update/locations/:id");

    req.query = handler.getRealRequest(req.query, req.body);

    logging.Parameter("request.query", req.query);

    updateLocation(req, res);


    logging.Leaving("POST /update/locations/:id");
}

function deleteLocations(req, res) {
    logging.Entering("POST /delete/locations");

    req.query = handler.getRealRequest(req.query, req.body);

    logging.Parameter("request.query", req.query);

    if (handler.checkIfValidQuery(req.query)) {
        operations.deleteObjects(locationCollection, req.query, function (err, item) {
            if (!err) {
                operations.updateObjects(eventCollection, {"locationMappings.location._id": new ObjectID(req.query._id)}, {
                    $pull: {
                        "locationMappings": {"location._id": req.query._id}
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

    logging.Leaving("POST /delete/locations");
}

function updateLocation(req, res) {
    logging.Entering("updateLocation");

    req.query = handler.getRealRequest(req.query, req.body);

    logging.Parameter("request.query", req.query);

    if (handler.checkIfValidQuery(req.query)) {
        operations.updateObject(locationCollection, handler.idFriendlyQuery({
            _id: req.params.id
        }), req.query, function (err, item) {
            if (!err && item.value) {
                operations.updateObjects(eventCollection, {"locationMappings.location._id": new ObjectID(req.params.id)}, {
                    $set: {
                        "locationMappings.$.location": item.value
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

    logging.Leaving("updateLocation");
}

module.exports = {
    findLocations,
    insertLocations,
    updateLocations,
    deleteLocations
};