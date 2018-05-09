const operations = require('../mongodb/operations');
const handler = require('../mongodb/handler');
const router = require('express').Router();

const minigamesCollection = require('../mongodb/collections').GAMES;

/* Global */

/* GET */
/* Find minigames(s) */
router.get('/find/minigames', function(req, res) {
    req.query = handler.getRealRequest(req.query, req.body);

    operations.findObject(minigamesCollection, (handler.checkIfValidQuery(req.query) ? req.query : null), function(err, item) {
        handler.dbResult(err, res, item, "Das Item " + JSON.stringify(req.query).replace(/\"/g, '') + " existiert nicht.");
    });
});

/* POST */
/* Insert minigames */
router.post('/insert/minigames', function(req, res) {
    // req.query["answers"] = req.body;
    req.query["answers"] = handler.getRealRequest(req.query["answers"], req.body);

    if (handler.checkIfValidQuery(req.query)) {
        operations.updateObject(minigamesCollection, req.query, null, function(err, item) {
            handler.dbResult(err, res, item, "Das Item " + JSON.stringify(req.query).replace(/\"/g, '') + " kann nicht hinzugefüt werden.");
        });
    } else {
        res.status(422).jsonp({
            "error" : "Die übergebenen Parameter sind ungültig"
        });
    }
});

/* Update minigames */
router.post('/update/minigames/:id', function(req, res) {
    req.query["answers"] = handler.getRealRequest(req.query["answers"], req.body);
    // req.query["answers"] = req.body;

    if (handler.checkIfValidQuery(req.query)) {
        operations.updateObject(minigamesCollection, handler.idFriendlyQuery({
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

/* Delete Minigames(s) */
router.post('/delete/minigames', function(req, res) {
    req.query = handler.getRealRequest(req.query, req.body);

    if (handler.checkIfValidQuery(req.query)) {
        operations.deleteObjects(minigamesCollection, req.query, function(err, item) {
            handler.dbResult(err, res, item, "Die Items mit den Eigenschaften " + JSON.stringify(req.query).replace(/\"/g, '') + " konnten nicht gelöscht werden.");
        });
    } else {
        res.status(422).jsonp({
            "error" : "Die übergebenen Parameter sind ungültig"
        });
    }
});

module.exports = router;