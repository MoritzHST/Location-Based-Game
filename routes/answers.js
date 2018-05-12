const operations = require('../mongodb/operations');
const router = require('express').Router();

const gameCollection = require('../mongodb/collections').GAMES;

/* Global */

/* Post */
/* Post Answer for an Game */
router.post('/post/answer', function (req, res) {
    let gameId = req.query.gameId;
    let answer = req.query.answer;
    operations.findObject(gameCollection, {_id: gameId}, function (err, item) {
        //Ungültge Game-ID escapen
        if (err || item === null) {
            res.status(422).jsonp({
                "error": "Es wurde kein Spiel mit der ID gefunden!"
            });
            return;
        }
        //Prüfen ob es eine Antwort für die Frage gibt, die den selben String hat und korrekt ist
        for (let i in item.answers) {
            if (item.answers.hasOwnProperty(i)) {
                if (item.answers[i].answer === answer && item.answers[i].isCorrect) {
                    res.status(200).jsonp({
                        "msg": "Die Antwort ist richtig"
                    });
                    return;
                }
            }
        }
        //Es wurde keine richtige Antwort gefunden, also muss sie falsch sein
        res.status(400).jsonp({
            "error": "Die Antwort ist falsch!"
        });
    });
});

module.exports = router;