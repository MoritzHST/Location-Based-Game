const operations = require('./mongodb/operations');
const handler = require('./mongodb/handler');
const express = require('express');
const router = require('express').Router();
const path = require('path');

/**
 * Login-Route zur Anmeldeseite. Prüft, ob der Benutzer bereits eingeloggt ist
 * und leitet diesen in solch einen Fall zur Übersichtseite.
 * @param req Request mit JSON-Query, welche Informationen über die aktuelle Session enthält.
 * @param res Result Status, welcher unter anderem den return-Code enthält
 * @param next die nächste anzusteuernde Route
 * @returns Die nächste zu benutzende Route
 */
router.use('/sign-up', function(req, res, next) {
     if (req.session && req.session.user) {
         res.redirect('/play');
     } else {
         next();
     }
});

/**
 * Route zum anmelden eines Benutzers. Sind der übergebene Token und Benutzername in Kombination gültig,
 * wird eine Session und Cookie erzeugt, andernfalls ein Fehler ausgegeben.
 * @param req Request mit JSON-Query, welche Informationen über den Benutzer enthält.
 * @param res Result Status, welcher unter anderem den return-Code enthält
 * @returns Der angemeldete Benutzer (oder eine Fehlermeldung)
 */
router.post('/login', function(req, res) {
    req.query = JSON.parse(JSON.stringify(req.body));
    if (req.query.name && req.query.token && req.session) {
        operations.findObject("users", req.query, function(err, user) {
            if (err || !user) {
                res.redirect('/sign-out');
            } else {
                req.session.user = user;
                req.session.maxAge = new Date().setHours(24,0,0,0) - new Date();
                res.status(200).jsonp(user);
            }
        });

        /*
         * operations.findObject("users", req.query, function(err, user) { if
         * (err || !user) { res.redirect('/sign-out'); } else { req.session.user =
         * user; res.append('Set-Cookie', 'name=session; expires=' + new
         * Date().setHours(24,0,0,0) - new Date()).status(200).jsonp(user); }
         * });
         */

    } else {
        res.status(422).jsonp({ "error": "Die übergebenen Daten sind nicht gültig." });
    }
});

/**
 * Logt einen Benutzer aus in dem dessen Cookie und Session gelöscht wird.
 * Im Anschluss wird dieser zur Anmeldeseite weitergeleitet.
 * @param req Request mit JSON-Query, welche Informationen über die aktuelle Session enthält.
 * @param res Result Status, welcher unter anderem den return-Code enthält
 * @returns Route zur Anmeldeseite
 */
router.get('/sign-out', function(req, res) {
    req.session = null;
    res.redirect('/sign-up');
});

/**
 * Default Route. Behandelt alle /GET anfragen, die nicht durch andere Routen abgedeckt wird.
 * Erlaubt js, stylesheets, partials; alles weitere wird zur Login Seite weitergeleitet.
 * @param req Request mit JSON-Query, welche Informationen über die aktuelle Session enthält.
 * @param res Result Status, welcher unter anderem den return-Code enthält
 * @param next die nächste anzusteuernde Route
 * @returns Die nächste anzusteuernde Route
 */
router.use('*', function(req, res, next) {
    if (handler.stringStartsWith([ "javascripts", "stylesheets", "partials" ], req.originalUrl)) {
        next();
    } else {
        if (!req.originalUrl.startsWith('/sign-up') && (!req.session || !req.session.user)) {
            res.status(302).redirect('/sign-up');
        } else {
             operations.findObject("users", req.session.user, function(err, user) {
                 if (err || !user) {
                     res.redirect('/sign-out');
                 } else {
                     next();
                 }
             });
        }
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
