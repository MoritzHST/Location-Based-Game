const objects = require('../mongodb/objects');
const logging = require('../helper/logging');

//Shuffle Funktion für Arrays
Array.prototype.shuffle = function () {
	logging.Entering("shuffle");
    let input = this;
    for (let i = input.length - 1; i >= 0; i--) {
        let randomIndex = Math.floor(Math.random() * (i + 1));
        let itemAtIndex = input[randomIndex];

        input[randomIndex] = input[i];
        input[i] = itemAtIndex;
    }
    logging.Leaving("shuffle");
    return input;
};

//Prüft ob in einem Array an Visit-Objekten ein Visit mit der übergebenen Id enthalten ist
function containsLocation(pVisits, pVisitId) {
	logging.Entering("containsLocation");
	logging.Parameter("pVisits", pVisits);
	logging.Parameter("pVisitId", pVisitId);
    let containsId = false;
    pVisits.forEach(function (visit) {
        if (pVisitId.toString() === visit.location._id.toString()) {
            containsId = true;
        }
    });
	logging.Leaving("containsLocation");
    return containsId;
}

//Gibt true zurück, wenn sich ein Objekt mit der GameId in der Liste an Spielen befindet, andernfalls false
function containsGame(pGames, pGameId) {
	logging.Entering("containsGame");
	logging.Parameter("pGames", pGames);
	logging.Parameter("pGameId", pGameId);
    let containsId = false;
    pGames.forEach(function (game) {
        if (pGameId.toString() === game._id.toString()) {
            containsId = true;
        }
    });
    logging.Leaving("containsGame");
    return containsId;
}

//Gibt dasjenige Visit-Objekt aus dem Array zurück, dessen Id mit der übergebenen übereinstimmt.
//Sollte keins existieren wird null zurück gegeben.
function getVisitWithId(pVisits, pVisitId) {
	logging.Entering("getVisitWithId");
	logging.Parameter("pVisits", pVisits);
	logging.Parameter("pVisitId", pVisitId);
    if (!pVisits) {
    	logging.Leaving("getVisitWithId");
        return;
    }
    let returnVisit = null;
    pVisits.forEach(function (visit) {
        if (visit.location._id.toString() === pVisitId.toString()) {
            returnVisit = visit;
        }
    });
    logging.Leaving("getVisitWithId");
    return returnVisit;
}

/**
 * Gibt das Eingangsobjekt, zusammen mit der jeweiligen Status-Flag zurück
 * @param pGame
 * @param pVisit
 * @returns {*}
 */
function calculateStateForGame(pGame, pVisit) {
	logging.Entering("calculateStateForGame");
	logging.Parameter("pGame", pGame);
	logging.Parameter("pVisit", pVisit);
    if (pVisit) {
        for (let i in pVisit.answers) {
            if (pVisit.answers.hasOwnProperty(i) && pVisit.answers[i].gameId.toString() === pGame._id.toString()) {
                pGame.state = pVisit.answers[i].state;
                logging.ReturnValue(pGame);
                logging.Leaving("calculateStateForGame");
                return pGame;
            }
        }
    }
    pGame.state = objects.GameStates.UNPLAYED;
    logging.ReturnValue(pGame);
    logging.Leaving("calculateStateForGame");
    return pGame;
}

module.exports = {

    hasAlreadyVisited: function (pUser, pLocation) {    	
    	logging.Entering("hasAlreadyVisited");    	
    	logging.Parameter("pUser", pUser);
    	logging.Parameter("pLocation", pLocation);
    	logging.Leaving("hasAlreadyVisited");
        return logging.ReturnValue(retuenValue = pUser.visits !== undefined && containsLocation(pUser.visits, pLocation._id));
    },

    addGameStates: function (pVisits, pGames, pLocationId) {
    	logging.Entering("addGameStates");
    	logging.Parameter("pVisits", pVisits);
        let visit = getVisitWithId(pVisits, pLocationId);
        for (let i in pGames) {
            if (pGames.hasOwnProperty(i)) {
                pGames[i] = calculateStateForGame(pGames[i], visit);
            }
        }
        logging.Leaving("addGameStates");
        return logging.ReturnValue(pGames);
    },

    /**
     * Erstellt eine Kopie des eingehenden Arrays an Games und verändert es dahingehend, dass die einzelnen Spiele
     * eine zufällige Auswahl an Fragen und Antworten enthalten. Dabei werden SingleChoice Spielen exakt eine richtige,
     * und maximal 3 falsche Antworten und bei MultipleChoice mindestens eine richtige und maximal 4 Antworten
     * insgesamt zugeordnet.
     * Games, die keine richtigen Antworten eingetragen haben, werden nicht wieder zurück ausgeliefert.
     * @param pGames
     * @returns {Array}
     */
    prepareGames: function (pGames) {
    	logging.Entering("prepareGames");
    	logging.Parameter("pGames", pGames);
        let games = [];

        pGames.forEach(function (game) {
            //Baue Antworten für für Fragen zusammen
            let maxCorrectAnswers;
            let maxAnswers = 4;

            let correctAnswers = [];
            let wrongAnswers = [];

            let outputAnswers = [];

            game.answers.forEach(function (answer) {
                if (answer.isCorrect) {
                    correctAnswers.push(answer);
                } else {
                    wrongAnswers.push(answer);
                }
            });

            if (game.type === objects.Type.SINGLE_CHOICE) {
                maxCorrectAnswers = 1;
            } else {
                maxCorrectAnswers = 4;
            }

            let correctAnswerCount = Math.floor((Math.random() * maxCorrectAnswers) + 1);

            correctAnswers.shuffle().forEach(function (answer) {
                if (outputAnswers.length < correctAnswerCount) {
                    answer.isCorrect = undefined;
                    outputAnswers.push(answer);
                }
            });

            wrongAnswers.shuffle().forEach(function (answer) {
                if (outputAnswers.length < maxAnswers) {
                    answer.isCorrect = undefined;
                    outputAnswers.push(answer);
                }
            });

            if (correctAnswers.length > 0 && outputAnswers.length > 0) {
                //Mindestens eine richtige Antwort vorhanden
                //Sende array zurück
                game.answers = outputAnswers.shuffle();
                games.push(game);
            }

        });
        logging.Leaving("addGameStates");
        return logging.ReturnValue(games);
    }

};
