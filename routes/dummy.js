const operations = require('../mongodb/operations');
const handler = require('../mongodb/handler');
const router = require('express').Router();

const minigamesCollection = require('../mongodb/collections').GAMES;

/* POST */
router.post('/dummy/:id', function(req, res) {
    req.query["answers"] = handler.getRealRequest(req.query["answers"], req.body);

    if (req.body)
        req.query["answers"] = req.body;

    if (handler.checkIfValidQuery(req.query)) {
        operations.findObject(minigamesCollection, handler.idFriendlyQuery({
            _id : req.params.id,
            answers : req.query["answers"]
        }), function(err, item) {
            if (item) {
                if (item.length > 0) {
                    // ToDo: Punkte zufügen, true zurückgeben?
                } else {
                    // ToDo: false zurückgeben
                }
            }
        });
    } else {
        res.status(422).jsonp({
            "error" : "Die übergebenen Parameter sind ungültig"
        });
    }
});

module.exports = router;