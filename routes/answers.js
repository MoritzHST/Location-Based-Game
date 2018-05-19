const operations = require('../mongodb/operations');
const answerChecker = require('../helper/answerChecker');
const router = require('express').Router();

const userCollection = require('../mongodb/collections').USERS;
const gameCollection = require('../mongodb/collections').GAMES;
const handler = require('../mongodb/handler');

/* Global */

/* Post */
/* Verarbeitet eine vom Benutzer gegebene Antwort*/
router.post('/post/answer', function (req, res) {
    req.query = handler.getRealRequest(req.query, req.body);operations.findObject(gameCollection, {_id: gameId}, function (err, item) {
        //Ungültge Game-ID escapen
        if (err || item === null) {
            res.status(422).jsonp({
                "error" : "Es wurde kein Spiel mit der ID gefunden!"
            });
            return;
        }
        //Antwortobjekt überprüfen
        if (answerChecker.checkAnswer(answer, item)) {
            res.status(200).jsonp({
                "msg": "Die Antwort ist richtig"
            });
            return;
        }

        //Es wurde keine richtige Antwort gefunden, also muss sie falsch sein
        res.status(400).jsonp({
            "error" : "Die Antwort ist falsch!"
        });
    });
    //Antwort persistieren
    operations.findObject(userCollection, req.session.user, function (userErr, userItem) {
        for (let i in userItem.visits) {
            if (userItem.visits[i].location._id === location) {
                for (let j in userItem.visits[i].games) {
                    if (userItem.visits[i].games[j]._id === gameId) {
                        userItem.visits[i].games[j].userAnswer = req.body;
                    }
                }
            }
        }
    });
});

module.exports = router;