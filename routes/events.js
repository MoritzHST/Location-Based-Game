const operations = require('../mongodb/operations');
const handler = require('../mongodb/handler');
const router = require('express').Router();

const eventCollection = require('../mongodb/collections').EVENTS;

/* Global */

/* GET */
/**
 * Gibt ein oder alle Events aus der Datenbak aus.
 * @param req Request mit JSON-Query, welche Informationen zum gesuchten Event enthält. Ist diese NULL, so werden alle Events ausgegeben.
 * @param res Result Status, welcher unter anderem den return-Code enthält
 * @returns Genau einen oder mehrere Events (oder eine Fehlermeldung)
 */
router.get('/find/events', function(req, res) {
    req.query = handler.getRealRequest(req.query, req.body);

    operations.findObject(eventCollection, (handler.checkIfValidQuery(req.query) ? req.query : null), function(err, item) {
        handler.dbResult(err, res, item, "Das Item " + JSON.stringify(req.query).replace(/\"/g, '') + " existiert nicht.");
    });
});

/* POST */
/**
 * Fügt ein Event der Datenbank hinzu. Ist der Name oder das Datum bereits in der Datenbank vorhanden,
 * wird das Event nicht angelegt und ein Fehler zurückgegeben
 * @param req Request mit JSON-Query, welche Informationen zum gesuchten Event enthält
 * @param res Result Status, welcher unter anderem den return-Code enthält
 * @returns Das hinzugefügte Event (oder eine Fehlermeldung)
 */
router.post('/insert/events', function(req, res) {
    req.query = handler.getRealRequest(req.query, req.body);
    if (handler.checkIfValidQuery(req.query)) {
        operations.findObject(eventCollection, {
            "name" : req.query.name
        }, function(err, item) {
            if (item) {
                res.status(422).jsonp({
                    "error" : "Es existiert bereits ein Event mit diesem Namen!"
                });
            } else if (err) {
                res.status(422).jsonp({
                    "error" : "Der übergebene Name ist ungültig."
                });
            } else {
                operations.findObject(eventCollection, {
                    "date" : req.query.date
                }, function(err, item) {
                    if (item) {
                        res.status(422).jsonp({
                            "error" : "Es existiert bereits ein Event mit diesem Datum!"
                        });
                    } else if (err) {
                        res.status(422).jsonp({
                            "error" : "Das übergebene Datum ist ungültig."
                        });
                    } else {
                        operations.updateObject(eventCollection, req.query, null, function(err, item) {
                            handler.dbResult(err, res, item, "Das Event " + JSON.stringify(req.query).replace(/\"/g, '') + " kann nicht hinzugefüt werden.");
                        });
                    }
                });
            }
        });
    } else {
        res.status(422).jsonp({
            "error" : "Die übergebenen Parameter sind ungültig"
        });
    }
});

/**
 * Aktualisiert ein Eventobjekt. Ist der Name oder das Datum bereits in der Datenbank vorhanden,
 * wird das Event nicht angelegt und ein Fehler zurückgegeben
 * @param req Request mit JSON-Query, welche Informationen zum gesuchten Evebt enthält.
 * @param res Result Status, welcher unter anderem den return-Code enthält
 * @returns Das aktualisierte Event
 */
router.post('/update/events/:id', function(req, res) {
    req.query = handler.getRealRequest(req.query, req.body);
    if (handler.checkIfValidQuery(req.query)) {
        operations.findObject(eventCollection, handler.idFriendlyQuery({
            "name" : req.query.name,
            _id : {
                $not : req.params.id
            }
        }), function(err, item) {
            if (item) {
                res.status(422).jsonp({
                    "error" : "Es existiert bereits ein anderes Event mit diesem Namen!"
                });
            } else if (err) {
                res.status(422).jsonp({
                    "error" : "Der übergebene Name ist ungültig."
                });
            } else {
                operations.findObject(eventCollection, handler.idFriendlyQuery({
                    "date" : req.query.date,
                    _id : {
                        $not : req.params.id
                    }
                }), function(err, item) {
                    if (item) {
                        res.status(422).jsonp({
                            "error" : "Es existiert bereits ein anderes Event mit diesem Datum!"
                        });
                    } else if (err) {
                        res.status(422).jsonp({
                            "error" : "Das übergebene Datum ist ungültig."
                        });
                    } else {
                        operations.updateObject(eventCollection, req.query, handler.idFriendlyQuery({
                            _id : req.params.id
                        }), function(err, item) {
                            handler.dbResult(err, res, item, "Das Event " + JSON.stringify(req.query).replace(/\"/g, '') + " kann nicht aktualisiert werden.");
                        });
                    }
                });
            }
        });
    } else {
        res.status(422).jsonp({
            "error" : "Die übergebenen Parameter sind ungültig"
        });
    }
});

/**
 * Löscht ein oder mehrere Events aus der Datenbank.
 * @param req Request mit JSON-Query, welche Informationen zum gesuchten Event enthält.
 * @param res Result Status, welcher unter anderem den return-Code enthält
 * @returns Das gelöschte Event
 */
router.post('/delete/events', function(req, res) {
    req.query = handler.getRealRequest(req.query, req.body);

    if (handler.checkIfValidQuery(req.query)) {
        operations.deleteObjects(eventCollection, req.query, function(err, item) {
            handler.dbResult(err, res, item, "Die Items mit den Eigenschaften " + JSON.stringify(req.query).replace(/\"/g, '') + " konnten nicht gelöscht werden.");
        });
    } else {
        res.status(422).jsonp({
            "error" : "Die übergebenen Parameter sind ungültig"
        });
    }
});

module.exports = router;