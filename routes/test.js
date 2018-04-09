const operations = require('../mongodb/operations');
var express = require('express');
var router = express.Router();

/* GET user page. */
/* /([^\s]+) */
router.get('/users', function (req, res, next) {
    operations.findAllObjects("users", function (items) {
        if (!items)
            res.status(422).jsonp({"error": "Collection users existiert nicht!"});
        else
            res.status(200).jsonp(items);
    });
});

router.get('/users/:name', function (req, res, next) {
    operations.findObject("users", {name: req.params.name}, function (item) {
        if (!item)
            res.status(422).jsonp({"error": "User " + req.params.name + " existiert nicht!"});
        else
            res.status(200).jsonp(item);
    });
});

module.exports = router;
