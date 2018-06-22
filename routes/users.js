const operations = require('../mongodb/operations');
const objects = require('../mongodb/objects');
const handler = require('../mongodb/handler');
const router = require('express').Router();
const logging = require('../helper/logging');

const userCollection = require('../mongodb/collections').USERS;

/* Global */

/* GET */
/**
 * Gibt einen oder alle Benutzer aus der Datenbak aus.
 * @param req Request mit JSON-Query, welche Informationen zum gesuchten Benutzer enthält. Ist diese NULL, so werden alle Benutzer ausgegeben.
 * @param res Result Status, welcher unter anderem den return-Code enthält
 * @returns Genau einen oder mehrere Benutzer (oder eine Fehlermeldung)
 */
router.get('/find/users', function(req, res) {
    logging.Entering("GET /find/users");
    req.query = handler.getRealRequest(req.query, req.body);
    logging.Parameter("request.query", req.query);

    operations.findObject(userCollection, (handler.checkIfValidQuery(req.query) ? req.query : null), function(err, item) {
        handler.dbResult(err, res, item, "Das Item " + JSON.stringify(req.query).replace(/\"/g, '') + " existiert nicht.");
    });
    logging.Leaving("GET /find/users");
});

/* POST */
/**
 * Fügt einem Benutzer der Datenbank hinzu. Ist der Name nicht erlaubt oder bereits in der Datenbank vorhanden,
 * wird der Benutzer nicht angelegt und ein Fehler zurückgegeben
 * @param req Request mit JSON-Query, welche Informationen zum gesuchten Benutzer enthält
 * @param res Result Status, welcher unter anderem den return-Code enthält
 * @returns Den hinzugefügten Benutzer (oder eine Fehlermeldung)
 */
router.post('/insert/users', function(req, res) {
    logging.Entering("POST /insert/users");
    req.query = handler.getRealRequest(req.query, req.body);
    logging.Parameter("request.query", req.query);

    operations.findObject(userCollection, req.query, function(err, item) {
        if (item !== null) {
            res.status(422).jsonp({
                "error" : "Nutzername ist bereits vergeben"
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
            operations.updateObject(userCollection, user, null, function(err, item) {
                handler.dbResult(err, res, item, "Der Benutzer " + JSON.stringify(user).replace(/\"/g, '') + " kann nicht hinzugefüt werden.");
            });
        } else {
            res.status(422).jsonp({
                "error" : "Die übergebenen Parameter sind ungültig"
            });
        }
    });
    logging.Leaving("POST /insert/users");
});

/**
 * Aktualisiert ein Benutzerobjekt. Ist der Name nicht erlaubt oder bereits in der Datenbank vorhanden,
 * wird der Benutzer nicht aktualisiert und ein Fehler zurückgegeben
 * @param req Request mit JSON-Query, welche Informationen zum gesuchten Benutzer enthält.
 * @param res Result Status, welcher unter anderem den return-Code enthält
 * @returns Den aktualisierten Benutzer
 */
router.post('/update/users/:id', function(req, res) {
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
        operations.findObject(userCollection, req.query, function(err, item) {
            if (item && item._id !== req.params.id) {
                res.status(422).jsonp("Es existiert bereits ein Benutzer mit diesem Namen.");
            } else {
                // wenn alle tests bestanden wurden, versuche die
                // Benutzerinformationen zu updaten.

                operations.updateObject(userCollection, handler.idFriendlyQuery({
                    _id : req.params.id
                }), req.query, function(err, item) {
                    handler.dbResult(err, res, item, "Der Benutzer " + req.params.id + " konnte nicht mit " + JSON.stringify(req.query).replace(/\"/g, '') + " aktualisiert werden.");
                });
            }
        });
    } else {
        res.status(422).jsonp({
            "error" : "Die übergebenen Parameter sind ungültig"
        });
    }
    logging.Leaving("POST /update/users/:id");
});

/**
 * Löscht einen Benutzer aus der Datenbank.
 * @param req Request mit JSON-Query, welche Informationen zum gesuchten Benutzer enthält.
 * @param res Result Status, welcher unter anderem den return-Code enthält
 * @returns Der gelöschte Benutzer
 */
router.post('/delete/users', function(req, res) {
    logging.Entering("POST /delete/users");
    req.query = handler.getRealRequest(req.query, req.body);
    logging.Parameter("request.query", req.query);

    if (handler.checkIfValidQuery(req.query)) {
        operations.deleteObjects(userCollection, req.query, function(err, item) {
            handler.dbResult(err, res, item, "Die Items mit den Eigenschaften " + JSON.stringify(req.query).replace(/\"/g, '') + " konnten nicht gelöscht werden.");
        });
    } else {
        res.status(422).jsonp({
            "error" : "Die übergebenen Parameter sind ungültig"
        });
    }
    logging.Leaving("POST /delete/users");
});

module.exports = router;