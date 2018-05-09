const operations = require('../mongodb/operations');
const handler = require('../mongodb/handler');
const router = require('express').Router();

const locationCollection = require('../mongodb/collections').LOCATIONS;

const fileHelper = require('../mongodb/fileHelper');
const multer = require('multer');
const upload = multer({
    dest : '../public/uploads/images/room',
    fileFilter : function(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(null, false);
        }
        cb(null, true);
    }
});

/* Global */

/* GET */
/* Find Location(s) */
router.get('/find/locations', function(req, res) {
    req.query = handler.getRealRequest(req.query, req.body);

    operations.findObject(locationCollection, (handler.checkIfValidQuery(req.query) ? req.query : null), function(err, item) {
        handler.dbResult(err, res, item, "Das Item " + JSON.stringify(req.query).replace(/\"/g, '') + " existiert nicht.");
    });
});

/* POST */
/* Insert Location */
router.post('/insert/locations', upload.single('image'), function(req, res) {
    req.query = handler.getRealRequest(req.query, req.body);

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
});

/* Update Location */
router.post('/update/locations/:id', upload.single('image'), function(req, res) {
    req.query = handler.getRealRequest(req.query, req.body);

    // lösche File wenn ein neues hochgeladen wird
    const file = req.file;
    if (file !== undefined && file !== null) {
        fileHelper.deleteFile(locationCollection, req.params.id, function() {
            req.query["image"] = file.path.replace("..\\public\\", "");
            updateRoom(req, res);
        });
    } else {
        updateRoom(req, res);
    }
});

/* Delete Location(s) */
router.post('/delete/locations', function(req, res) {
    req.query = handler.getRealRequest(req.query, req.body);

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
});

function updateRoom(req, res) {
    req.query = handler.getRealRequest(req.query, req.body);

    if (handler.checkIfValidQuery(req.query)) {
        operations.updateObject(locationCollection, handler.idFriendlyQuery({
            _id : req.params.id
        }), req.query, function(err, item) {
            handler.dbResult(err, res, item, "Das Item " + req.params.id + " konnte nicht mit " + JSON.stringify(req.query).replace(/\"/g, '') + " geupdatet werden.");
        });
    } else {
        res.status(422).jsonp({
            "error" : "Die übergebenen Parameter sind ungültig"
        });
    }
}

module.exports = router;