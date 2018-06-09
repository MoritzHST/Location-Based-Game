const objects = require("../mongodb/objects");
const logging = require("./logging");
const operations = require('../mongodb/operations');
const answerChecker = require('../helper/answerChecker');
const eventHelper = require('../helper/event');
const userCollection = require('../mongodb/collections').USERS;
const ObjectID = require('mongodb').ObjectID;
const WebSocket = require('websocket').client;


async function isRoomCompleted(pRequest, pEvent) {
    logging.Entering("isRoomCompleted");
    logging.Parameter("request.query", pRequest.query);

    return new Promise(resolve => {
        operations.findObject(userCollection, {
            _id: pRequest.session.user._id,
            "visits.location.identifier": pRequest.query.identifier
        }, function (userError, userItem) {
            if (userItem) {
                //aktuellen Visit suchen
                let curVisit = findVisitByLocationIdentifier(userItem, pRequest.query.identifier);
                if (curVisit.answers) {
                    //Prüfen ob genausoviele Antworten wie Spiele zu der Location existieren, wenn ja ist er fertig
                    let mappingItem = answerChecker.findLocationById(pEvent, curVisit.location._id);
                    if (mappingItem && mappingItem.games.length === curVisit.answers.length) {
                        resolve(curVisit.answers);
                        return;
                    }
                }
            }
            resolve(false);
        });
    });
}

async function canAnswerQuiz(pRequest) {
    logging.Entering("canAnswerQuiz");
    logging.Parameter("request.query", pRequest.query);

    let gameObj;
    let locationObj;
    //Prüft ob Location bereits gescannt wurde
    await operations.findObject(userCollection, {
        _id: pRequest.session.user._id,
        "visits.location._id": ObjectID(pRequest.query.locationId)
    }).then(async function (userItemLocation) {
        if (userItemLocation) {
            //Pürft ob Frage bereits beatnwrotet
            locationObj = userItemLocation;
            gameObj = await operations.findObject(userCollection, {
                _id: pRequest.session.user._id,
                "visits.answers.gameId": pRequest.query.gameId
            });
        }
    });
    logging.Leaving("canAnswerQuiz");
    //Das Spiel darf nicht gespielt worden sein, der Raum muss gescannt sein
    return !gameObj && locationObj;
}

function saveAnswer(pRequest, pState, pEvent, pGame) {
    logging.Entering("saveAnswer");
    logging.Parameter("request.query", pRequest.query);
    logging.Parameter("pState", pState);
    //Antwort persistieren
    operations.findObject(userCollection, {_id: pRequest.session.user._id}, function (userErr, userItem) {
        for (let i in userItem.visits) {
            if (userItem.visits.hasOwnProperty(i) && userItem.visits[i].location._id.toString() === pRequest.query.locationId.toString()) {
                if (!userItem.visits[i].answers) {
                    userItem.visits[i].answers = [];
                }
                //State übernehmen
                pRequest.query.state = pState;
                userItem.visits[i].answers.push(pRequest.query);
            }
        }
        userItem.score.games += 1;
        userItem.score.locations = userItem.visits.length;
        if (pState === objects.GameStates.CORRECT) {
            userItem.score.score = userItem.score ? userItem.score.score + pGame.points : pGame.points;
        }
        // Score Connection aktualisieren
        broadcastScore(userItem, pEvent);

        operations.updateObject(userCollection, {
                _id: userItem._id
            },
            userItem, function () {
                evaluateLocation(pRequest, pEvent);
            });
    });
    logging.Leaving("saveAnswer");
}

/**
 * Analysiert die Location und setzt entsprechcend ihrer Vollständigkeit ein Flag
 * welches beschreibt, ob die Location abgeschlossen ist oder nicht
 * @param pRequest
 * @param pEvent
 */
function evaluateLocation(pRequest, pEvent) {
    logging.Entering("evaluateLocation");
    logging.Parameter("request.query", pRequest.query);

    let mappingItem = answerChecker.findLocationById(pEvent, pRequest.query.locationId);
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
    logging.Leaving("evaluateLocation");
}

/**
 * Analysiert einen einzelnen Besuch und setzt entsprechend des Status flags
 * welches beschreibt, ob der Besucht vollständig ist doer nicht
 * @param pVisit
 * @param pMapping
 * @returns {*}
 */
function analyzeVisits(pVisit, pMapping) {
    logging.Entering("analyzeVisits");
    logging.Parameter("pVisit", pVisit);
    logging.Parameter("pMapping", pMapping);
    //Gibt es so viele Antworten wie Spiele? Wenn nein, ist der Raum nur besucht und nicht abgeschlossen
    if (pMapping.games.length !== pVisit.answers.length) {
        logging.ReturnValue(objects.RoomStates.VISITED);
        logging.Leaving("analyzeVisit");
        return objects.RoomStates.VISITED;
    }
    else {
        logging.Leaving("analyzeVisit");
        return analyzeAnswers(pVisit);
    }
}

/**
 * Prüft die einzelnen Antworten zu einem Visit
 * Der Visit ist FLAWLESS, wenn alle Antworten richtig waren
 * Wenn eine Falsch ist, ist der Visist Completed
 * @param pVisit
 * @returns {number}
 */
function analyzeAnswers(pVisit) {
    logging.Entering("analyzeAnswers");
    logging.Parameter("pVisit", pVisit);
    for (let j in pVisit.answers) {
        //Es gibt so viele Antworten wie Spiele, also ist der Raum schon einmal abgeschlossen
        //Wenn eine falsch ist -> completed
        //Wenn keine falsch ist -> flawless
        if (pVisit.answers.hasOwnProperty(j) && pVisit.answers[j].state === objects.GameStates.WRONG) {
            logging.ReturnValue(objects.RoomStates.COMPLETED);
            logging.Leaving("analyzeAnswers");
            return objects.RoomStates.COMPLETED;
        }
    }
    //Keine war falsch
    logging.ReturnValue(objects.RoomStates.FLAWLESS);
    logging.Leaving("analyzeAnswers");
    return objects.RoomStates.FLAWLESS;
}

/**
 * Hilfsfunktion, die ein Visistobjekt innerhalb vom Nutzer Anhand von pIdentifier (Location.Identifier)
 * selektiert
 * @param pUserObj
 * @param pIdentifier
 * @returns Visit-Objekt
 */
function findVisitByLocationIdentifier(pUserObj, pIdentifier) {
    logging.Entering("findVisitByLocationIdentifier");
    logging.Parameter("pUserObj", pUserObj);
    logging.Parameter("pIdentifier", pIdentifier);

    for (let i in pUserObj.visits) {
        if (pUserObj.visits.hasOwnProperty(i) && pUserObj.visits[i].location.identifier === pIdentifier) {
            logging.ReturnValue(pUserObj.visits[i]);
            logging.Leaving("findVisitByLocationIdentifier");
            return pUserObj.visits[i];
        }
    }
    logging.Leaving("findVisitByLocationIdentifier");
}

function broadcastScore(pUser, pEvent) {
    // Score Connection aktualisieren
    let ws = new WebSocket();
    ws.on("connect", function (connection) {
        connection.send(JSON.stringify({
            userId: pUser._id,
            score: eventHelper.formatScoreObject(pEvent, pUser.score)
        }));
        connection.close();
    });
    ws.connect("ws://127.0.0.1:3000/score");
}

module.exports = {

    isRoomCompleted,
    canAnswerQuiz,
    saveAnswer,
    evaluateLocation,
    analyzeVisits,
    analyzeAnswers

};