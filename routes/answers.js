const operations = require('../mongodb/operations');
const router = require('express').Router();
const gameCollection = require('../mongodb/collections').GAMES;
const handler = require('../mongodb/handler');

/* Global */

/* Post */
/* Verarbeitet eine vom Benutzer gegebene Antwort */
router.post('/post/answer', function(req, res) {
    req.query = handler.getRealRequest(req.query, req.body);

    operations.findObject(gameCollection, {
        _id : req.query.gameId
    }, function(err, item) {
        // Ungültge Game-ID escapen
        if (err || item === null) {
            res.status(422).jsonp({
                "error" : "Es wurde kein Spiel mit der ID gefunden!"
            });
            return;
        }

        // Prüfen ob es eine Antwort für die Frage gibt, die den selben String
        // hat und korrekt ist
        for ( let i in item.answers) {
            if (item.answers.hasOwnProperty(i) && item.answers[i].answer === req.query.answer && item.answers[i].isCorrect) {
                res.status(200).jsonp({
                    "msg" : "Die Antwort ist richtig"
                });
                return;
            }
        }

        // Es wurde keine richtige Antwort gefunden, also muss sie falsch sein
        res.status(400).jsonp({
            "error" : "Die Antwort ist falsch!"
        });
    });
});

module.exports = router;