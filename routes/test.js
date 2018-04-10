const operations = require('../mongodb/operations');
const handler = require('../mongodb/handler');
var express = require('express');
var router = express.Router();

/* GET user page. */
/* /([^\s]+) */
router.get('/users', function (req, res, next) {
    operations.findAllObjects("users", function (err, items) {
    	handler.dbResult(err, res, items, "Collection users");
    });
});

router.get('/users/:name', function (req, res, next) {
    operations.findObject("users", {name: req.params.name}, function (err, item) {    	
    	handler.dbResult(err, res, item, "User " + req.params.name);           
    });
});

module.exports = router;