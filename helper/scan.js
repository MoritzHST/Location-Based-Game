const objects = require('../mongodb/objects');

//Shuffle Funktion für Arrays
Array.prototype.shuffle = function () {
    let input = this;
    for (let i = input.length - 1; i >= 0; i--) {
        let randomIndex = Math.floor(Math.random() * (i + 1));
        let itemAtIndex = input[randomIndex];

        input[randomIndex] = input[i];
        input[i] = itemAtIndex;
    }
    return input;
};

//Prüft ob in einem Array an Visit-Objekten ein Visit mit der übergebenen Id enthalten ist
function containsLocation(pVisits, pVisitId) {
    let containsId = false;
    pVisits.forEach(function (visit) {
        if (pVisitId.toString() === visit.location._id.toString()) {
            containsId = true;
        }
    });
    return containsId;
}

//Gibt true zurück, wenn sich ein Objekt mit der GameId in der Liste an Spielen befindet, andernfalls false
function containsGame(pGames, pGameId) {
    let containsId = false;
    pGames.forEach(function (game) {
        if (pGameId.toString() === game._id.toString()) {
            containsId = true;
        }
    });
    return containsId;
}

//Gibt dasjenige Visit-Objekt aus dem Array zurück, dessen Id mit der übergebenen übereinstimmt.
//Sollte keins existieren wird null zurück gegeben.
function getVisitWithId(pVisits, pVisitId) {
    let returnVisit = null;
    pVisits.forEach(function (visit) {
        if (visit.location._id.toString() === pVisitId.toString()) {
            returnVisit = visit;
        }
    });
    return returnVisit;
}

module.exports = {

    hasAlreadyVisited: function (pUser, pLocation) {
        return pUser.visits !== undefined && containsLocation(pUser.visits, pLocation._id);
    },

    addGameStates: function (pVisits, pGames, pLocationId) {
        let visit = getVisitWithId(pVisits, pLocationId);
        pGames.forEach(function (game) {
            if (containsGame(visit.games, game._id)) {
                //TODO setze correct oder wrong
                game.played = objects.GameStates.CORRECT;
            } else {
                game.played = objects.GameStates.UNPLAYED;
            }
        });
        return pGames;
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

        return games;
    }


};