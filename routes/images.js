const operations = require('../mongodb/operations');
const objects = require('../mongodb/objects');
const handler = require('../mongodb/handler');
const router = require('express').Router();
const logging = require('../helper/logging');
const atob = require("atob");

const imageCollection = require('../mongodb/collections').IMAGES;

/* Global */

/* GET */
/**
 * Gibt einen oder alle Bilder aus der Datenbak aus.
 * @param req Request mit JSON-Query, welche Informationen zum gesuchten Bild enthält. Ist diese NULL, so werden alle Bilder ausgegeben.
 * @param res Result Status, welcher unter anderem den return-Code enthält
 * @returns Genau einen oder mehrere Bilder (oder eine Fehlermeldung)
 */
router.get('/find/images', function (req, res) {
    logging.Entering("GET /find/images");
    req.query = handler.getRealRequest(req.query, req.body);
    logging.Parameter("request.query", req.query);

    operations.findObject(imageCollection, (handler.checkIfValidQuery(req.query) ? req.query : null), function (err, item) {
        handler.dbResult(err, res, item, "Das Item " + JSON.stringify(req.query).replace(/\"/g, '') + " existiert nicht.");
    });
    logging.Leaving("GET /find/images");
});

/* POST */
/**
 * Fügt ein Bildobjekt der Datenbank hinzu
 * @param req Request mit JSON-Query, welche Informationen zum gesuchten Bild enthält
 * @param res Result Status, welcher unter anderem den return-Code enthält
 * @returns Das hinzugefügt Bild (oder eine Fehlermeldung)
 */
router.post('/insert/images', function (req, res) {
    logging.Entering("POST /insert/images");
    req.query = handler.getRealRequest(req.query, req.body);
    logging.Parameter("request.query", req.query);

    operations.findObject(imageCollection, req.query, function (err, item) {
        if (item !== null) {
            res.status(422).jsonp({
                "error": "Bild existiert bereits"
            });
            return;
        }

        let user = new objects.Image(req.query.name, req.query.data);

        if (handler.checkIfValidQuery(user)) {
            operations.updateObject(imageCollection, user, null, function (err, item) {
                handler.dbResult(err, res, item, "Der Benutzer " + JSON.stringify(user).replace(/\"/g, '') + " kann nicht hinzugefüt werden.");
            });
        } else {
            res.status(422).jsonp({
                "error": "Die übergebenen Parameter sind ungültig"
            });
        }
    });
    logging.Leaving("POST /insert/images");
});

/**
 * Aktualisiert ein Bildobjekt. Ist der Name nicht erlaubt oder bereits in der Datenbank vorhanden,
 * wird das Bild nicht aktualisiert und ein Fehler zurückgegeben
 * @param req Request mit JSON-Query, welche Informationen zum gesuchten Benutzer enthält.
 * @param res Result Status, welcher unter anderem den return-Code enthält
 * @returns Das aktualisierte Bild
 */
router.post('/update/images/:id', function (req, res) {
    logging.Entering("POST /update/images/:id");
    req.query = handler.getRealRequest(req.query, req.body);
    logging.Parameter("request.query", req.query);

    if (handler.checkIfValidQuery(req.query)) {

        // prüfe, ob der eingegebene Name bereits verwendet wird.
        operations.findObject(imageCollection, req.query, function (err, item) {
            if (item && item._id !== req.params.id) {
                res.status(422).jsonp("Es existiert bereits ein Bild mit diesem Namen.");
            } else {
                // wenn alle tests bestanden wurden, versuche die
                // Bildinformationen zu updaten.

                operations.updateObject(imageCollection, handler.idFriendlyQuery({
                    _id: req.params.id
                }), req.query, function (err, item) {
                    handler.dbResult(err, res, item, "Das Bild " + req.params.id + " konnte nicht mit " + JSON.stringify(req.query).replace(/\"/g, '') + " aktualisiert werden.");
                });
            }
        });
    } else {
        res.status(422).jsonp({
            "error": "Die übergebenen Parameter sind ungültig"
        });
    }
    logging.Leaving("POST /update/images/:id");
});

/**
 * Löscht ein Bild aus der Datenbank.
 * @param req Request mit JSON-Query, welche Informationen zum gesuchten Bild enthält.
 * @param res Result Status, welcher unter anderem den return-Code enthält
 * @returns Das gelöschte Bild
 */
router.post('/delete/images', function (req, res) {
    logging.Entering("POST /delete/images");
    req.query = handler.getRealRequest(req.query, req.body);
    logging.Parameter("request.query", req.query);

    if (handler.checkIfValidQuery(req.query)) {
        operations.deleteObjects(imageCollection, req.query, function (err, item) {
            handler.dbResult(err, res, item, "Die Items mit den Eigenschaften " + JSON.stringify(req.query).replace(/\"/g, '') + " konnten nicht gelöscht werden.");
        });
    } else {
        res.status(422).jsonp({
            "error": "Die übergebenen Parameter sind ungültig"
        });
    }
    logging.Leaving("POST /delete/images");
});

module.exports = router;