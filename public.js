const operations = require('./mongodb/operations');
const handler = require('./mongodb/handler');
const express = require('express');
const userCollection = require('./mongodb/collections').USERS;
const router = require('express').Router();
const path = require('path');
const ObjectID = require('mongodb').ObjectID;
/**
 * Event-Route zur startseite. Sollte es am heutigen Tag ein Event geben, erfolgt eine Weiterleitung zur sign-up Seite
 * @param req Request mit JSON-Query, welche Informationen über die aktuelle Session enthält.
 * @param res Result Status, welcher unter anderem den return-Code enthält
 * @param next die nächste anzusteuernde Route
 * @returns Die nächste zu benutzende Route
 */
router.use('/no-event', function (req, res, next) {
    operations.findObject("events", {"date": new Date().toJSON().slice(0, 10)}, function (err, item) {
        if (item) {
            res.redirect('/sign-up');
        } else if (err) {
            res.status(422).jsonp({"error": "Die übergebenen Daten sind nicht gültig."});
        } else {
            next();
        }
    });
});

/**
 * Login-Route zur Anmeldeseite. Prüft, ob der Benutzer bereits eingeloggt ist
 * und leitet diesen in solch einen Fall zur Übersichtseite.
 * @param req Request mit JSON-Query, welche Informationen über die aktuelle Session enthält.
 * @param res Result Status, welcher unter anderem den return-Code enthält
 * @param next die nächste anzusteuernde Route
 * @returns Die nächste zu benutzende Route
 */
router.use('/sign-up', function (req, res, next) {
    operations.findObject("events", {"date": String(new Date().toJSON().slice(0, 10))}, function (err, item) {
        if (!item) {
            res.redirect('/no-event');
        } else if (err) {
            res.status(422).jsonp({"error": "Die übergebenen Daten sind nicht gültig."});
        } else if (req.session && req.session.user) {
            res.redirect('play');
        } else {
            next();
        }
    });
});

/**
 * Route zum anmelden eines Benutzers. Sind der übergebene Token und Benutzername in Kombination gültig,
 * wird eine Session und Cookie erzeugt, andernfalls ein Fehler ausgegeben.
 * @param req Request mit JSON-Query, welche Informationen über den Benutzer enthält.
 * @param res Result Status, welcher unter anderem den return-Code enthält
 * @returns Der angemeldete Benutzer (oder eine Fehlermeldung)
 */
router.post('/login', function (req, res) {
    req.query = JSON.parse(JSON.stringify(req.body));

    if (req.query.name && req.query.token && req.session) {
        operations.findObject(userCollection, {
            name: {$regex: req.query.name + "$", $options: "i"},
            token: req.query.token
        }, function (err, user) {
            if (err || !user) {
                req.session = null;
                res.status(422).jsonp({"error": "Es wurde kein Nutzer zu den angegebenen Daten gefunden."});
            } else {
                require('./helper/eventHelper').getCurrentEvent()
                    .then(function (pEvent) {
                        req.session.user = user;
                        req.session.user.score = require('./helper/eventHelper').formatScoreObject(pEvent, user.score);
                        req.session.login = new Date() / 1;
                        req.session.maxAge = new Date().setHours(24, 0, 0, 0) - new Date();
                        res.status(200).jsonp(user);
                    });
            }
        });
    } else {
        res.status(422).jsonp({"error": "Die übergebenen Daten sind nicht gültig."});
    }
});

/**
 * Logt einen Benutzer aus in dem dessen Cookie und Session gelöscht wird.
 * Im Anschluss wird dieser zur Anmeldeseite weitergeleitet.
 * @param req Request mit JSON-Query, welche Informationen über die aktuelle Session enthält.
 * @param res Result Status, welcher unter anderem den return-Code enthält
 * @returns Route zur Anmeldeseite
 */
router.get('/sign-out', function (req, res) {
    req.session = null;
    res.redirect('/sign-up');
});

/**
 * Testet, eingehende play Anfragen, ob Zugriff auf diese Seite erlaubt ist. Dies ist nur dann der Fall, Wenn eine Benutzer Session existiert
 * @param req Request mit JSON-Query, welche Informationen über die aktuelle Session enthält.
 * @param res Result Status, welcher unter anderem den return-Code enthält
 * @param next die nächste anzusteuernde Route
 * @returns Die nächste anzusteuernde Route
 */
router.use('/play', function (req, res, next) {
    if (!req.session || !req.session.user) {
        res.status(302).redirect('/sign-up');
    } else {
        operations.findObject(userCollection, {
            name: req.session.user.name,
            token: req.session.user.token
        }, function (err, user) {
            if (err || !user) {
                res.status(302).redirect('/sign-out');
            } else {
                next();
            }
        });
    }
});

/**
 * Implementiert alle im Public Ordner befindlichen Dateien als aufrufbare Elemente.
 * Aufruf funktioniert auch ohne die Angabe von .html, .htm Endung.
 */
router.use(express.static(path.join(__dirname, 'public'), {
    extensions: ['html', 'htm']
}));

module.exports = router;
