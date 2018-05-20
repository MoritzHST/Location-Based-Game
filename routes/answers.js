const operations = require('../mongodb/operations');
const answerChecker = require('../helper/answerChecker');
const objects = require('../mongodb/objects');
const router = require('express').Router();
const ObjectID = require('mongodb').ObjectID;

const userCollection = require('../mongodb/collections').USERS;
const gameCollection = require('../mongodb/collections').GAMES;
const locationMappingCollection = require('../mongodb/collections').LOCATION_MAPPING;
const handler = require('../mongodb/handler');

/* Global */

/* Post */
/* Verarbeitet eine vom Benutzer gegebene Antwort*/
router.post('/post/answer', function (req, res) {
    req.query = handler.getRealRequest(req.query, req.body);
    operations.findObject(gameCollection, {_id: req.query.gameId}, function (err, item) {
        //Ungültge Game-ID escapen
        if (err || item === null) {
            res.status(422).jsonp({
                "error": "Es wurde kein Spiel mit der ID gefunden!"
            });
            return;
        }
        //Antwortobjekt überprüfen
        if (answerChecker.checkAnswer(req.query.answer, item)) {
            res.status(200).jsonp({
                "msg": "Die Antwort ist richtig"
            });
            saveAnswer(req, objects.GameStates.CORRECT);
            return;
        }

        //Es wurde keine richtige Antwort gefunden, also muss sie falsch sein
        res.status(400).jsonp({
            "error": "Die Antwort ist falsch!"
        });
        saveAnswer(req, objects.GameStates.WRONG);
        return;
    });
});

function saveAnswer(pRequest, pState) {
    //Antwort persistieren
    operations.findObject(userCollection, {_id: pRequest.session.user._id}, function (userErr, userItem) {
        for (let i in userItem.visits) {
            if (userItem.visits.hasOwnProperty(i) && userItem.visits[i].location._id.toString() === pRequest.query.locationId.toString()) {
                if (!userItem.visits[i].answers) {
                    userItem.visits[i].answers = [];
                }
                pRequest.query.state = pState;
                userItem.visits[i].answers.push(pRequest.query);
            }
        }

        operations.updateObject(userCollection, {
                _id: userItem._id
            },
            userItem, function () {
                evaluateLocation(pRequest);
            });
    });
}

function evaluateLocation(pRequest) {
    operations.findObject(locationMappingCollection, {"location._id": ObjectID(pRequest.query.locationId)}, function (mappingError, mappingItem) {
            operations.findObject(userCollection, {"_id": pRequest.session.user._id}, function (userError, userItem) {
                for (let i in userItem.visits) {
                    //Den Besuch selektieren, der den gleichen Ort referenziert wie das Mapping
                    if (userItem.visits.hasOwnProperty(i) && userItem.visits[i].location._id.toString() === mappingItem.location._id.toString()) {
                        //Status des Raumes aktualisieren
                        userItem.visits[i].state = analyzeVisits(userItem.visits[i], mappingItem);
                    }
                }
                operations.updateObject(userCollection, {
                        _id: userItem._id
                    },
                    userItem, function () {
                    });
            });
        }
    );
}

function analyzeVisits(pVisit, pMapping) {
    //Gibt es so viele Antworten wie Spiele? Wenn nein, ist der Raum nur besucht und nicht abgeschlossen
    if (pMapping.games.length !== pVisit.answers.length) {
        return objects.RoomStates.VISITED;
    }
    else {
        return analyzeAnswers(pVisit);
    }
}

function analyzeAnswers(pVisit) {
    for (let j in pVisit.answers) {
        //Es gibt so viele Antworten wie Spiele, also ist der Raum schon einmal abgeschlossen
        //Wenn eine falsch ist -> completed
        //Wenn keine falsch ist -> flawless
        if (pVisit.answers.hasOwnProperty(j) && pVisit.answers[j].state === objects.GameStates.WRONG) {
            return objects.RoomStates.COMPLETED;
        }
    }
    //Keine war falsch
    return objects.RoomStates.FLAWLESS;
}

module.exports = router;