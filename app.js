var createError = require('http-errors');
var express = require('express');
var fs = require('file-system');
var path = require('path');
var bodyParser = require('body-parser');
var logger = require('morgan');
var randomstring = require("randomstring");
var cookieSession = require('cookie-session');

var app = express();
var swaggerUi = require('swagger-ui-express');
var swaggerDocument = require('./swagger.json');

/**
 * Konfiguriert Views (Path) zur Benutzung
 */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

/**
 * Definiert Benutzer Session-Cookie. Standard Max-Alter ist 24h
 * 24 * 60 * 60 * 1000,
 * maxAge: new Date().setHours(24,0,0,0) - new Date(),
 */
app.use(cookieSession({
    name: 'session',
    keys: [""],
    signed: true,
    httpOnly: false
}));

// This allows you to set req.session.maxAge to let certain sessions
// have a different value than the default.
app.use(function (req, res, next) {
    req.sessionOptions.maxAge = req.session.maxAge || req.sessionOptions.maxAge;
    next();
});

/**
 * Benutzt Routen für Swagger Tests (für Admin)
 */
app.use('/admin/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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

/**
 * Fängt 404 Fehler ab und leitet zur Login Seite weiter
 * @param req Angeforderte Daten
 * @param res Derzeitige Antwort
 * @returns Weiterleitung zur Login Seite
 */
 app.use(function (req, res) {
     res.status(302).redirect('/sign-up');
 });

// Fehler Behandlung
 app.use(function (err, req, res) {
     // Gibt Fehlermeldung nur in einer Entwicklungsumgebung aus
     res.locals.message = err.message;
     res.locals.error = req.app.get('env') === 'development' ? err : {};

     // Gibt im Fehlerfall eine entsprechende Seite aus
     // Diese ist noch NICHT konfiguriert!
     res.status(err.status || 500);
     res.render('error');
 });



module.exports = app;
