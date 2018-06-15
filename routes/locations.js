const operations = require('../mongodb/operations');
const handler = require('../mongodb/handler');
const ObjectID = require('mongodb').ObjectID;
const router = require('express').Router();
const logging = require('../helper/logging');

const locationCollection = require('../mongodb/collections').LOCATIONS;
const eventCollection = require('../mongodb/collections').EVENTS;

const fileHelper = require('../mongodb/fileHelper');
const multer = require('multer');
const upload = multer({
    dest: '../public/uploads/images/exposition',
    fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(null, false);
        }
        cb(null, true);
    }
});

/* Global */

/* GET */
/* Gibt ein oder alle Location(s) zurück */
router.get('/find/locations', function(req, res) {
    logging.Entering("GET /find/locations");

    req.query = handler.getRealRequest(req.query, req.body);

    logging.Parameter("request.query", req.query);

    operations.findObject(locationCollection, (handler.checkIfValidQuery(req.query) ? req.query : null), function(err, item) {
        handler.dbResult(err, res, item, "Das Item " + JSON.stringify(req.query).replace(/\"/g, '') + " existiert nicht.");
    });

    logging.Leaving("GET /find/locations");
});

/* POST */
/* Fügt eine Location der Datenbank hinz */
router.post('/insert/locations', upload.single('image'), function(req, res) {
    logging.Entering("POST /insert/locations");

    req.query = handler.getRealRequest(req.query, req.body);

    logging.Parameter("request.query", req.query);

    // hinterlege Pfad zum File, wenn File hochgeladen wurde
    const file = req.file;
    if (file !== undefined && file !== null) {
        req.query["image"] = file.path.replace("..\\public\\", "");
    }

    if (handler.checkIfValidQuery(req.query)) {
        operations.updateObject(locationCollection, req.query, null, function(err, item) {
            handler.dbResult(err, res, item, "Das Item " + JSON.stringify(req.query).replace(/\"/g, '') + " kann nicht hinzugefüt werden.");
        });
    } else {
        res.status(422).jsonp({
            "error" : "Die übergebenen Parameter sind ungültig"
        });
    }

    logging.Leaving("POST /insert/locations");
});

/* Aktualisiert eine Location mit einer bestimmten id */
router.post('/update/locations/:id', upload.single('image'), function(req, res) {
    logging.Entering("POST /update/locations/:id");

    req.query = handler.getRealRequest(req.query, req.body);

    logging.Parameter("request.query", req.query);

    // lösche File wenn ein neues hochgeladen wird
    const file = req.file;
    if (file !== undefined && file !== null) {
        fileHelper.deleteFile(locationCollection, req.params.id, function() {
            req.query["image"] = file.path.replace("..\\public\\", "");
            updateLocation(req, res);
        });
    } else {
        updateLocation(req, res);
    }

    logging.Leaving("POST /update/locations/:id");
});

/* Löscht Location(s) */
router.post('/delete/locations', function(req, res) {
    logging.Entering("POST /delete/locations");

    req.query = handler.getRealRequest(req.query, req.body);

    logging.Parameter("request.query", req.query);

    fileHelper.deleteFile(locationCollection, req.query._id, function() {
        if (handler.checkIfValidQuery(req.query)) {
            operations.deleteObjects(locationCollection, req.query, function(err, item) {
                handler.dbResult(err, res, item, "Die Items mit den Eigenschaften " + JSON.stringify(req.query).replace(/\"/g, '') + " konnten nicht gelöscht werden.");
            });
        } else {
            res.status(422).jsonp({
                "error" : "Die übergebenen Parameter sind ungültig"
            });
        }
    });

    logging.Leaving("POST /delete/locations");
});

function updateLocation(req, res) {
    logging.Entering("updateLocation");

    req.query = handler.getRealRequest(req.query, req.body);

    logging.Parameter("request.query", req.query);

    if (handler.checkIfValidQuery(req.query)) {
        operations.updateObject(locationCollection, handler.idFriendlyQuery({
            _id : req.params.id
        }), req.query, function(err, item) {
            if (!err && item.value) {
                operations.updateObject(eventCollection, {
                    "locationMappings": {
                        "$elemMatch": {
                            "location._id": new ObjectID(req.params.id)
                        }
                    }
                }, {
                    "locationMappings.$.location": item.value
                }, function (event_err, event_item) {
                    handler.dbResult(event_err, res, event_item, "Das Item " + item + " konnte nicht mit " + JSON.stringify(req.query).replace(/\"/g, '') + " geupdatet werden.");
                });
            } else {
                handler.dbResult(err, res, item, "Das Item " + req.params.id + " konnte nicht mit " + JSON.stringify(req.query).replace(/\"/g, '') + " geupdatet werden.");
            }
        });
    } else {
        res.status(422).jsonp({
            "error" : "Die übergebenen Parameter sind ungültig"
        });
    }

    logging.Leaving("updateLocation");
}

module.exports = router;