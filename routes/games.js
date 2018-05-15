const operations = require('../mongodb/operations');
const handler = require('../mongodb/handler');
const router = require('express').Router();

const minigamesCollection = require('../mongodb/collections').GAMES;

/* Global */

/* GET */
/* Gibt ein oder mehrere Minigames zurück */
router.get('/find/minigames', function (req, res) {
    operations.findObject(minigamesCollection, (handler.checkIfValidQuery(req.query) ? req.query : null), function (err, item) {
        handler.dbResult(err, res, item, "Das Item " + JSON.stringify(req.query).replace(/\"/g, '') + " existiert nicht.");
    });
});

/* POST */
/* Fügt ein Minigame der Datenbank hinzu */
router.post('/insert/minigames', function (req, res) {
    req.query["answers"] = req.body;
    if (handler.checkIfValidQuery(req.query)) {
        operations.updateObject(minigamesCollection, req.query, null, function (err, item) {
            handler.dbResult(err, res, item, "Das Item " + JSON.stringify(req.query).replace(/\"/g, '') + " kann nicht hinzugefüt werden.");
        });
    } else {
        res.status(422).jsonp({
            "error": "Die übergebenen Parameter sind ungültig"
        });
    }
});

/* Aktualisiert ein Minigame mit einer bestimmten id */
router.post('/update/minigames/:id', function (req, res) {
    if (req.body !== null && req.body !== undefined) {
        req.query["answers"] = req.body;
    }
    if (handler.checkIfValidQuery(req.query)) {
        operations.updateObject(minigamesCollection, handler.idFriendlyQuery({
            _id: req.params.id
        }), req.query, function (err, item) {
            handler.dbResult(err, res, item, "Das Item " + req.params.id + " konnte nicht mit " + JSON.stringify(req.query).replace(/\"/g, '') + " geupdatet werden.");
        });
    } else {
        res.status(422).jsonp({
            "error": "Die übergebenen Parameter sind ungültig"
        });
    }
});

/* Löscht ein Minigame aus der Datenbank */
router.post('/delete/minigames', function (req, res) {
    if (handler.checkIfValidQuery(req.query)) {
        operations.deleteObjects(minigamesCollection, req.query, function (err, item) {
            handler.dbResult(err, res, item, "Die Items mit den Eigenschaften " + JSON.stringify(req.query).replace(/\"/g, '') + " konnten nicht gelöscht werden.");
        });
    } else {
        res.status(422).jsonp({
            "error": "Die übergebenen Parameter sind ungültig"
        });
    }
});

module.exports = router;