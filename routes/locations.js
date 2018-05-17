const operations = require('../mongodb/operations');
const handler = require('../mongodb/handler');
const router = require('express').Router();

const locationCollection = require('../mongodb/collections').LOCATIONS;

/* Global */

/* GET */
/* Gibt ein oder alle Location(s) zurück */
router.get('/find/locations', function (req, res) {
    operations.findObject(locationCollection, (handler.checkIfValidQuery(req.query) ? req.query : null), function (err, item) {
        handler.dbResult(err, res, item, "Das Item " + JSON.stringify(req.query).replace(/\"/g, '') + " existiert nicht.");
    });
});

/* POST */
/* Fügt eine Location der Datenbank hinzu */
router.post('/insert/locations', function (req, res) {
    updateLocation(req, res);
});

/* Aktualisiert eine Location mit einer bestimmten id */
router.post('/update/locations/:id', function (req, res) {
    updateLocation(req, res);
});

/* Löscht Location(s) */
router.post('/delete/locations', function (req, res) {
    if (handler.checkIfValidQuery(req.query)) {
        operations.deleteObjects(locationCollection, req.query, function (err, item) {
            handler.dbResult(err, res, item, "Die Items mit den Eigenschaften " + JSON.stringify(req.query).replace(/\"/g, '') + " konnten nicht gelöscht werden.");
        });
    } else {
        res.status(422).jsonp({
            "error": "Die übergebenen Parameter sind ungültig"
        });
    }
});

function updateLocation(req, res) {
    if (handler.checkIfValidQuery(req.query)) {
        operations.updateObject(locationCollection, handler.idFriendlyQuery({
            _id: req.params.id
        }), req.query, function (err, item) {
            handler.dbResult(err, res, item, "Das Item " + req.params.id + " konnte nicht mit " + JSON.stringify(req.query).replace(/\"/g, '') + " geupdatet werden.");
        });
    } else {
        res.status(422).jsonp({
            "error": "Die übergebenen Parameter sind ungültig"
        });
    }
}


module.exports = router;