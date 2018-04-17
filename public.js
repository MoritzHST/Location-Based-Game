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
    operations.findObject("users", (handler.checkIfValidQuery(req.query) ? req.query : null), function(err, user) {
        if (err) {
            res.status(422).jsonp(err);
        } else {
            req.session.user = user;
            res.status(200).jsonp(user);
        }
    });
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
