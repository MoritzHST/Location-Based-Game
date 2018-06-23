const operations = require('../../mongodb/operations');
const objects = require('../../mongodb/objects');
const handler = require('../../mongodb/handler');
const logging = require('../logging');
const userCollection = require('../../mongodb/collections').USERS;

function findUsers(req, res) {
    logging.Entering("GET /find/users");
    req.query = handler.getRealRequest(req.query, req.body);
    logging.Parameter("request.query", req.query);

    operations.findObject(userCollection, (handler.checkIfValidQuery(req.query) ? req.query : null), function (err, item) {
        handler.dbResult(err, res, item, "Das Item " + JSON.stringify(req.query).replace(/\"/g, '') + " existiert nicht.");
    });
    logging.Leaving("GET /find/users");
}

function insertUser(req, res) {
    logging.Entering("POST /insert/users");
    req.query = handler.getRealRequest(req.query, req.body);
    logging.Parameter("request.query", req.query);

    operations.findObject(userCollection, req.query, function (err, item) {
        if (item !== null) {
            res.status(422).jsonp({
                "error": "Nutzername ist bereits vergeben"
            });
            return;
        }
        const validity = handler.getUsernameValidity(req.query.name);
        if (!validity.isValid) {
            res.status(422).jsonp(validity.err);
            return;
        }
        let user = new objects.User(req.query.name);

        if (handler.checkIfValidQuery(user)) {
            operations.updateObject(userCollection, user, null, function (err, item) {
                handler.dbResult(err, res, item, "Der Benutzer " + JSON.stringify(user).replace(/\"/g, '') + " kann nicht hinzugefüt werden.");
            });
        } else {
            res.status(422).jsonp({
                "error": "Die übergebenen Parameter sind ungültig"
            });
        }
    });
    logging.Leaving("POST /insert/users");
}

function updateUser(req, res) {
    logging.Entering("POST /update/users/:id");
    req.query = handler.getRealRequest(req.query, req.body);
    logging.Parameter("request.query", req.query);

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
                    _id: req.params.id
                }), req.query, function (err, item) {
                    handler.dbResult(err, res, item, "Der Benutzer " + req.params.id + " konnte nicht mit " + JSON.stringify(req.query).replace(/\"/g, '') + " aktualisiert werden.");
                });
            }
        });
    } else {
        res.status(422).jsonp({
            "error": "Die übergebenen Parameter sind ungültig"
        });
    }
    logging.Leaving("POST /update/users/:id");
}

function deleteUser(req, res) {
    logging.Entering("POST /delete/users");
    req.query = handler.getRealRequest(req.query, req.body);
    logging.Parameter("request.query", req.query);

    if (handler.checkIfValidQuery(req.query)) {
        operations.deleteObjects(userCollection, req.query, function (err, item) {
            handler.dbResult(err, res, item, "Die Items mit den Eigenschaften " + JSON.stringify(req.query).replace(/\"/g, '') + " konnten nicht gelöscht werden.");
        });
    } else {
        res.status(422).jsonp({
            "error": "Die übergebenen Parameter sind ungültig"
        });
    }
    logging.Leaving("POST /delete/users");
}

module.exports = {
    findUsers,
    insertUser,
    updateUser,
    deleteUser
};