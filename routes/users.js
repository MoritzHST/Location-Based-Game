const operations = require('../mongodb/operations');
const handler = require('../mongodb/handler');
const router = require('express').Router();

const userCollection = require('../mongodb/collections').USERS;

/* Global */

/* GET */
/* Find User(s) */
router.get('/find/users', function(req, res) {
    operations.findObject(userCollection, (handler.checkIfValidQuery(req.query) ? req.query : null), function (err, item) {
        handler.dbResult(err, res, item, "Das Item " + JSON.stringify(req.query).replace(/\"/g, '') + " existiert nicht.");
    });
});

/* POST */
/* Insert User */
router.post('/insert/users', function(req, res) {
    const username = req.query.name;

    operations.findObject(userCollection, {
        "name" : username.trim()
    }, function(err, item) {
        if (item !== null) {
            res.status(422).jsonp({
                "error" : "Nutzername ist bereits vergeben"
            });
            return;
        }
        const validity = handler.getUsernameValidity(username);
        if (!validity.isValid) {
            res.status(422).jsonp(validity.err);
            return;
        }

        // generiere zufälligen User-Token
        req.query.token = operations.generateToken();

        if (handler.checkIfValidQuery(req.query)) {
            operations.updateObject(userCollection, req.query, null, function (err, item) {
                handler.dbResult(err, res, item, "Das Item " + JSON.stringify(req.query).replace(/\"/g, '') + " kann nicht hinzugefüt werden.");
            });
        } else {
            res.status(422).jsonp({
                "error" : "Die übergebenen Parameter sind ungültig"
            });
        }
    });
});

/* Update User */
router.post('/update/users/:id', function(req, res) {
    if (handler.checkIfValidQuery(req.query)) {

        // prüfe, ob der eingegebene Name zulässig ist.
        let username = req.query.name;
        if (username !== undefined) {
            const validity = handler.getUsernameValidity(username);
            if (!validity.isValid) {
                res.status(422).jsonp(validity.err);
                return;
            }
        }

        // prüfe, ob der eingegebene Name bereits verwendet wird.
        operations.findObject(userCollection, req.query, function (err, item) {
            if (item && item._id !== req.params.id) {
                res.status(422).jsonp("Es existiert bereits ein Benutzer mit diesem Namen.");
            } else {
                // wenn alle tests bestanden wurden, versuche die
                // Benutzerinformationen zu updaten.

                operations.updateObject(userCollection, handler.idFriendlyQuery({
                    _id : req.params.id
                }), req.query, function(err, item) {
                    handler.dbResult(err, res, item, "Das Item " + req.params.id + " konnte nicht mit " + JSON.stringify(req.query).replace(/\"/g, '') + " geupdatet werden.");
                });
            }
        });
    } else {
        res.status(422).jsonp({
            "error" : "Die übergebenen Parameter sind ungültig"
        });
    }
});

/* Delete User(s) */
router.post('/delete/users', function(req, res) {
    if (handler.checkIfValidQuery(req.query)) {
        operations.deleteObjects(userCollection, req.query, function (err, item) {
            handler.dbResult(err, res, item, "Die Items mit den Eigenschaften " + JSON.stringify(req.query).replace(/\"/g, '') + " konnten nicht gelöscht werden.");
        });
    } else {
        res.status(422).jsonp({
            "error" : "Die übergebenen Parameter sind ungültig"
        });
    }
});

module.exports = router;