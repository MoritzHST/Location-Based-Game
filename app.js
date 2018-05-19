var createError = require('http-errors');
var express = require('express');
var fs = require('file-system');
var path = require('path');
var bodyParser = require('body-parser');
var logger = require('morgan');
var randomstring = require("randomstring");
var cookieSession = require('cookie-session');
var auth = require("http-auth");

var app = express();
var swaggerUi = require('swagger-ui-express');
var swaggerDocument = require('./swagger.json');

/**
 * Fügt eine Passwortabfrage beim Serveraufruf hinzu
 * http://www.dotnetcurry.com/nodejs/1237/digest-authentication-nodejs-application
 * https://www.sitepoint.com/http-authentication-in-node-js/
 * https://github.com/http-auth/http-auth
 */

if (process.env.env === "development") {
    var digest = auth.digest({
        realm: "Test Area",
        file: "../htpasswd",
        msg401: "Du bist nicht berechtigt diese Seite aufzurufen."
    });

    app.use(auth.connect(digest));
}

/**
 * Konfiguriert Views (Path) zur Benutzung
 */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

/**
 * Definiert Benutzer Session-Cookie.
 */
app.use(cookieSession({
    name: 'session',
    keys: [""],
    signed: true,
    httpOnly: false
}));

/**
 * Diese Route erlaubt den Benutzer eine andere Cookie Dauer als die Standarddauer zu haben.
 * Aktualisiert den Benutzer Cookie minütlich.
 * @param req Angeforderte Daten
 * @param res Derzeitige Antwort
 * @param next Nächste zutreffende Route
 */
app.use(function (req, res, next) {
    if (req.sessionOptions.maxAge !== req.session.maxAge) {
        req.sessionOptions.maxAge = req.session.maxAge;
        req.session.nowInMinutes = Math.floor(Date.now() / 60e3);
    }
    next();
});

/**
 * Benutzt alle Routen, die in routes definiert sind
 */
fs.readdirSync('../routes/').forEach(file => {
    app.use('/', require('./routes/' + file));
});

/**
 * Benutzt für den Seiteneinstieg Dateien aus dem Public Ordner
 */
app.use('/', require('./public'));

/* Fehler */

/**
 * Fängt 404 Fehler ab und leitet zur Login Seite weiter
 * @param req Angeforderte Daten
 * @param res Derzeitige Antwort
 * @returns Weiterleitung zur Login Seite
 */
app.use(function (req, res, next) {
     if (req.originalUrl.startsWith('/admin')) {
         next();
     } else {
         res.status(302).redirect('/sign-up');
     }
});

/* Admin */

var admin = auth.digest({
    realm: "Admin Area",
    file: "../htpasswd",
    msg401: "Du bist nicht berechtigt diese Seite aufzurufen."
});

app.use(auth.connect(admin));

/**
 * Benutzt Routen für Swagger Tests (für Admin)
 */
app.use('/admin/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/**
 * Route für Admin Zugriff
 */
app.use('/admin', express.static(path.join(__dirname, 'admin'), {
    extensions: ['html', 'htm']
}));

app.use(function (req, res) {
    res.status(302).redirect('/admin/start');
});

module.exports = app;
