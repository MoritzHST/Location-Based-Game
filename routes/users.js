const operations = require('../mongodb/operations');
const handler = require('../mongodb/handler');
const router = require('express').Router();

/* Global */

/* GET */
/* Find User(s) */
router.get('/find/users', function (req, res) {
    operations.findObject("users", (handler.checkIfValidQuery(req.query) ? req.query : null), function (err, item) {
        handler.dbResult(err, res, item, "Das Item " + JSON.stringify(req.query).replace(/\"/g, '') + " existiert nicht.");
    });
});

/* POST */
/* Insert User */
router.post('/insert/users', function (req, res) {
    const username = req.query.name;

    handler.checkUsernameValidity(username, function (pErr) {
        res.status(422).jsonp(pErr);
    });

    //generiere zufälligen User-Token
    req.query.token = operations.generateToken();

    if (handler.checkIfValidQuery(req.query)) {
        operations.updateObject("users", req.query, null, function (err, item) {
            handler.dbResult(err, res, item, "Das Item " + JSON.stringify(req.query).replace(/\"/g, '') + " kann nicht hinzugefüt werden.");
        });
    } else {
        res.status(422).jsonp({
            "error": "Die übergebenen Parameter sind ungültig"
        });
    }
});

/* Update User */
router.post('/update/users/:id', function (req, res) {
    let username = req.query.name;
    if (username !== undefined) {
        handler.checkUsernameValidity(username, function (pErr) {
            res.status(422).jsonp(pErr);
        });
    }

    if (handler.checkIfValidQuery(req.query)) {
        operations.updateObject("users", handler.idFriendlyQuery({
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

/* Delete User(s) */
router.post('/delete/users', function (req, res) {
    if (handler.checkIfValidQuery(req.query)) {
        operations.deleteObjects("users", req.query, function (err, item) {
            handler.dbResult(err, res, item, "Die Items mit den Eigenschaften " + JSON.stringify(req.query).replace(/\"/g, '') + " konnten nicht gelöscht werden.");
        });
    } else {
        res.status(422).jsonp({
            "error": "Die übergebenen Parameter sind ungültig"
        });
    }
});

module.exports = router;