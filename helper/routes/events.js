const operations = require('../../mongodb/operations');
const handler = require('../../mongodb/handler');
const eventCollection = require('../../mongodb/collections').EVENTS;

function findEvents(req, res) {
    req.query = handler.getRealRequest(req.query, req.body);
    operations.findObject(eventCollection, (handler.checkIfValidQuery(req.query) ? req.query : null), function (err, item) {
        handler.dbResult(err, res, item, "Das Item " + JSON.stringify(req.query).replace(/\"/g, '') + " existiert nicht.");
    });
}

function insertEvent(req, res) {
    req.query = handler.getRealRequest(req.query, req.body);
    if (handler.checkIfValidQuery(req.query)) {

        operations.findObject(eventCollection, {date: req.query.date},
            function (err, item) {
                if (item && item.date) {
                    res.status(422).jsonp({
                        "error": "Es existiert bereits ein Event mit diesem Datum!"
                    });
                } else if (err) {
                    res.status(422).jsonp({
                        "error": "Das übergebene Datum ist ungültig."
                    });
                } else {
                    operations.updateObject(eventCollection, req.query, null, function (err, item) {
                        handler.dbResult(err, res, item, "Das Event " + JSON.stringify(req.query).replace(/\"/g, '') + " kann nicht hinzugefüt werden.");
                    });
                }
            });
    } else {
        res.status(422).jsonp({
            "error": "Die übergebenen Parameter sind ungültig"
        });
    }
}

function updateEvent(req, res) {
    req.query = handler.getRealRequest(req.query, req.body);
    if (handler.checkIfValidQuery(req.query)) {
        if (req.query.name) {
            req.query._id = {$not: req.params.id};
            operations.findObject(eventCollection, handler.idFriendlyQuery(req.query), function (err, item) {
                if (item) {
                    res.status(422).jsonp({
                        "error": "Es existiert bereits ein anderes Event mit diesem Datum!"
                    });
                } else if (err) {
                    res.status(422).jsonp({
                        "error": "Das übergebene Datum ist ungültig."
                    });
                } else {
                    operations.updateObject(eventCollection, handler.idFriendlyQuery({
                        _id: req.params.id
                    }, req.query), function (err, item) {
                        handler.dbResult(err, res, item, "Das Event " + JSON.stringify(req.query).replace(/\"/g, '') + " kann nicht aktualisiert werden.");
                    });
                }
            });
        } else {
            operations.updateObject(eventCollection, handler.idFriendlyQuery({
                _id: req.params.id
            }, req.query), function (err, item) {
                handler.dbResult(err, res, item, "Das Event " + JSON.stringify(req.query).replace(/\"/g, '') + " kann nicht aktualisiert werden.");
            });
        }
    } else {
        res.status(422).jsonp({
            "error": "Die übergebenen Parameter sind ungültig"
        });
    }
}

function deleteEvent(req, res) {
    req.query = handler.getRealRequest(req.query, req.body);

    if (handler.checkIfValidQuery(req.query)) {
        operations.deleteObjects(eventCollection, req.query, function (err, item) {
            handler.dbResult(err, res, item, "Die Items mit den Eigenschaften " + JSON.stringify(req.query).replace(/\"/g, '') + " konnten nicht gelöscht werden.");
        });
    } else {
        res.status(422).jsonp({
            "error": "Die übergebenen Parameter sind ungültig"
        });
    }
}

module.exports = {
    findEvents,
    insertEvent,
    updateEvent,
    deleteEvent
};