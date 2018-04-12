var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', {
        title: 'NodeJSPrototype'
    });
});

/* GET admin page */
router.get('/admin', function (req, res) {
    res.render('admin', {
        title: 'NodeJSPrototype'
    });
});

module.exports = router;
