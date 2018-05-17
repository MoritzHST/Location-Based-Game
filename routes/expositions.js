const operations = require('../mongodb/operations');
const handler = require('../mongodb/handler');
const router = require('express').Router();

const expositionCollection = require('../mongodb/collections').EXPOSITIONS;

const fileHelper = require('../mongodb/fileHelper');
const multer = require('multer');
const upload = multer(
    {
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
router.get('/find/expositions', function (req, res) {
    operations.findObject(expositionCollection, (handler.checkIfValidQuery(req.query) ? req.query : null), function (err, item) {
        handler.dbResult(err, res, item, "Das Item " + JSON.stringify(req.query).replace(/\"/g, '') + " existiert nicht.");
    });
});

/* POST */
/* Fügt eine Location der Datenbank hinzu */
router.post('/insert/expositions', upload.fields([{
    name: 'thumbnailPath',
    maxCount: 1
}, {name: 'imagePaths'}]), function (req, res) {

    //hinterlege Pfad zum File, wenn File hochgeladen wurde
    const file = req.file;
    if (file) {
        if (file["thumbnailPath"]) {
            req.query["thumbnailPath"] = file["thumbnailPath"].path.replace("..\\public\\", "");
        }
        if (file["imagePaths"]) {
            req.query["imagePaths"] = [];
            file["imagePaths"].forEach(function (image) {
                let path = image.path.replace("..\\public\\", "");
                req.query["imagePaths"].push(path);
            });
        }

    }

    if (handler.checkIfValidQuery(req.query)) {
        operations.updateObject(expositionCollection, req.query, null, function (err, item) {
            handler.dbResult(err, res, item, "Das Item " + JSON.stringify(req.query).replace(/\"/g, '') + " kann nicht hinzugefüt werden.");
        });
    } else {
        res.status(422).jsonp({
            "error": "Die übergebenen Parameter sind ungültig"
        });
    }
});

/* Aktualisiert eine Location mit einer bestimmten id */
router.post('/update/expositions/:id', upload.single('image'), function (req, res) {
    //lösche File wenn ein neues hochgeladen wird
    const file = req.file;
    if (file) {
        fileHelper.deleteFile(expositionCollection, req.params.id, function () {
            req.query["thumbnailPath"] = file.path.replace("..\\public\\", "");
            updateRoom(req, res);
        });
    } else {
        updateRoom(req, res);
    }
});

/* Löscht Location(s) */
router.post('/delete/expositions', function (req, res) {
    fileHelper.deleteFile(expositionCollection, req.query._id, function () {
        if (handler.checkIfValidQuery(req.query)) {
            operations.deleteObjects(expositionCollection, req.query, function (err, item) {
                handler.dbResult(err, res, item, "Die Items mit den Eigenschaften " + JSON.stringify(req.query).replace(/\"/g, '') + " konnten nicht gelöscht werden.");
            });
        } else {
            res.status(422).jsonp({
                "error": "Die übergebenen Parameter sind ungültig"
            });
        }
    });
});

function updateRoom(req, res) {
    if (handler.checkIfValidQuery(req.query)) {
        operations.updateObject(expositionCollection, handler.idFriendlyQuery({
            _id: req.params.id
        }), req.query, function (err, item) {
            handler.dbResult(err, res, item, "Das Item " + req.params.id + " konnte nicht mit " + JSON.stringify(req.query).replace(/\"/g, '') + " geupdatet werden.");
        });
    } else {
        res.status(422).jsonp({
            "error": "Die übergebenen Parameter sind ungültig"
        });
    }
}


module.exports = router;