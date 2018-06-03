const operations = require('../mongodb/operations');
const answerChecker = require('../helper/answerChecker');
const objects = require('../mongodb/objects');
const router = require('express').Router();
const logging = require('../helper/logging');


const gameCollection = require('../mongodb/collections').GAMES;
const locationMappingCollection = require('../mongodb/collections').LOCATION_MAPPING;
const eventsCollection = require('../mongodb/collections').EVENTS;
const handler = require('../mongodb/handler');
const eventHelper = require('../helper/event');
const answerHelper = require('../helper/answerHelper');

/* Global */

/* Post */
/* Verarbeitet eine vom Benutzer gegebene Antwort*/
router.post('/post/answer', async function (req, res) {
    logging.Entering("POST /post/answer");
    req.query = handler.getRealRequest(req.query, req.body);
    logging.Parameter("request.query", req.query);

    try {
        req.session.user._id;
    } catch (e) {
        res.status(422).jsonp({
            error: "Du musst eingeloggt sein um diese Funktion zu nutzen"
        });
        return;
    }

    let currentEvent = await eventHelper.getCurrentEvent();
    if (!currentEvent) {
        res.status(422).jsonp({
            "error": eventHelper.noEventMessage
        });
        logging.Error("Aktuell findet kein Event statt");
        return;
    }

    answerHelper.canAnswerQuiz(req)
        .then(function (pObj) {
            if (!pObj) {
                res.status(423).jsonp({
                    "error": "Netter Versuch, https://www.hochschule-stralsund.de/host/fakultaeten/elektrotechnik-und-informatik/studienangebot/it-sicherheit-und-mobile-systeme-smsb/"
                });
                return;
            }

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
                    answerHelper.saveAnswer(req, objects.GameStates.CORRECT, currentEvent, item);
                    return;
                }

                //Es wurde keine richtige Antwort gefunden, also muss sie falsch sein
                res.status(400).jsonp({
                    "error": "Die Antwort ist falsch!"
                });
                answerHelper.saveAnswer(req, objects.GameStates.WRONG, currentEvent, item);
            });
        });
    logging.Leaving("POST /post/answer");
});

/* Get */
/* Prüft, ob der Raum abgeschlossen ist
 * Wenn ja, wird dem User ein Objekt mit Antworten zu den Spielen ausgegeben */
router.get('/get/answers', async function (req, res) {
    logging.Entering("GET /get/answers");
    req.query = handler.getRealRequest(req.query, req.body);
    logging.Parameter("request.query", req.query);

    try {
        req.session.user._id;
    } catch (e) {
        res.status(422).jsonp({
            error: "Du musst eingeloggt sein um diese Funktion zu nutzen"
        });
        return;
    }

    let currentEvent = await eventHelper.getCurrentEvent();
    if (!currentEvent) {
        res.status(422).jsonp({
            "error": eventHelper.noEventMessage
        });
        logging.Error("Aktuell findet kein Event statt");
        return;
    }

    answerHelper.isRoomCompleted(req, currentEvent).then(function (pObj) {
        if (pObj) {
            res.status(200).jsonp(pObj);
        }
        else {
            res.status(422).jsonp({
                "error": "Der Raum wurde noch nicht besucht"
            });
        }
    });
    logging.Leaving("GET /get/answers");
});

module.exports = router;