const operations = require('../mongodb/operations');
const objects = require('../mongodb/objects');
const handler = require('../mongodb/handler');
var express = require('express');
var router = express.Router();

/* Global */

/* GET */
/* Find User(s) */
router.get('/find/:collection', function (req, res) {
	operations.findObject(req.params.collection, (handler.checkIfValidQuery(req.query) ? req.query : null), function (err, item) {			
    	handler.dbResult(err, res, item, "Das Item " + JSON.stringify(req.query).replace(/\"/g, '') + " existiert nicht.");
    });
});

/* POST*/
/* Insert User */
router.post('/insert/:collection', function (req, res) {
	if (handler.checkIfValidQuery(req.query)) {
		operations.updateObject(req.params.collection, req.query, null, function (err, item) {
			handler.dbResult(err, res, item, "Das Item " + JSON.stringify(req.query).replace(/\"/g, '') + " kann nicht hinzugefüt werden.");
		});
	} else {
		res.status(422).jsonp({"error": "Die übergebenen Parameter sind ungültig"});
	}
});

/* Update User */
router.post('/update/:collection/:id', function (req, res) {
	if (handler.checkIfValidQuery(req.query)) {
		operations.updateObject(req.params.collection, handler.idFriendlyQuery({_id: req.params.id}), req.query, function (err, item) {
			handler.dbResult(err, res, item, "Das Item " + req.params.id + " konnte nicht mit " + JSON.stringify(req.query).replace(/\"/g, '') + " geupdatet werden.");
		})
	} else {
		res.status(422).jsonp({"error": "Die übergebenen Parameter sind ungültig"});
	}
});

/* Delete User(s) */
router.post('/delete/:collection', function (req, res) {
	if (handler.checkIfValidQuery(req.query)) {
		operations.deleteObjects(req.params.collection, req.query, function (err, item) {
			handler.dbResult(err, res, item, "Die Items mit den Eigenschaften " + JSON.stringify(req.query).replace(/\"/g, '') + " konnten nicht gelöscht werden.");
		});
	} else {
		res.status(422).jsonp({"error": "Die übergebenen Parameter sind ungültig"});
	}	
});

module.exports = router;