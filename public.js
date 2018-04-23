const operations = require('./mongodb/operations');
const handler = require('./mongodb/handler');
const express = require('express');
const router = require('express').Router();
const path = require('path');

router.use('/sign-up', function(req, res, next) {
     // if session is set --> redirect to /play, otherwise send sign-up html
     if (req.session && req.session.user) {
         res.redirect('/play');
     } else {
         next();
     }
});

/* Only allowed when session exists */

router.post('/login', function(req, res) {
    req.query = JSON.parse(JSON.stringify(req.body));
    if (req.query.name && req.query.token) {
        operations.findObject("users", req.query, function(err, user) {
            if (err || !user) {
                res.status(422).jsonp({"error": "Die übergebenen Daten sind nicht gültig."});
            } else {
                req.session.user = user;
                res.status(200).jsonp(user);
            }
        });
    } else {
        res.status(422).jsonp({ "error": "Die übergebenen Daten sind nicht gültig." });
    }
});

/* Whenever used, redirect to default site */
/* Sign-Out */
router.get('/sign-out', function(req, res) {
    req.session = null;
    res.redirect('/sign-up');
});

/* Other */

router.use('*', function(req, res, next) {
    if (handler.stringStartsWith([ "javascripts", "stylesheets", "partials" ], req.originalUrl)) {
        next();
    } else {
        if (req.originalUrl !== '/sign-up' && (!req.session || !req.session.user)) {
            res.status(302).redirect('/sign-up');
        } else {
            next();
        }
    }
});

router.use(express.static(path.join(__dirname, 'public'), {
    extensions: ['html', 'htm']
}));

module.exports = router;
