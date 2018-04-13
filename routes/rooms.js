const operations = require('../mongodb/operations');
const handler = require('../mongodb/handler');
const router = require('express').Router();

/* Global */

/* GET */
/* Find Room(s) */
router.get('/find/rooms', function(req, res) {
    operations.findObject("rooms", (handler.checkIfValidQuery(req.query) ? req.query : null), function(err, item) {
        handler.dbResult(err, res, item, "Das Item " + JSON.stringify(req.query).replace(/\"/g, '') + " existiert nicht.");
    });
});

/* POST */
/* Insert Room */
router.post('/insert/rooms', function(req, res) {
    if (handler.checkIfValidQuery(req.query)) {
        operations.updateObject("rooms", req.query, null, function(err, item) {
            handler.dbResult(err, res, item, "Das Item " + JSON.stringify(req.query).replace(/\"/g, '') + " kann nicht hinzugefüt werden.");
        });
    } else {
        res.status(422).jsonp({
            "error" : "Die übergebenen Parameter sind ungültig"
        });
    }
});

/* Update Room */
router.post('/update/rooms/:id', function(req, res) {
    if (handler.checkIfValidQuery(req.query)) {
        operations.updateObject("rooms", handler.idFriendlyQuery({
            _id : req.params.id
        }), req.query, function(err, item) {
            handler.dbResult(err, res, item, "Das Item " + req.params.id + " konnte nicht mit " + JSON.stringify(req.query).replace(/\"/g, '') + " geupdatet werden.");
        });
    } else {
        res.status(422).jsonp({
            "error" : "Die übergebenen Parameter sind ungültig"
        });
    }
});

/* Delete Room(s) */
router.post('/delete/rooms', function(req, res) {
    if (handler.checkIfValidQuery(req.query)) {
        operations.deleteObjects("rooms", req.query, function(err, item) {
            handler.dbResult(err, res, item, "Die Items mit den Eigenschaften " + JSON.stringify(req.query).replace(/\"/g, '') + " konnten nicht gelöscht werden.");
        });
    } else {
        res.status(422).jsonp({
            "error" : "Die übergebenen Parameter sind ungültig"
        });
    }
});

module.exports = router;