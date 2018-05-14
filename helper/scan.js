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

function containsLocation(pVisits, pId) {
    let containsId = false;
    pVisits.forEach(function (visit) {
        if (pId.toString() === visit.location._id.toString()) {
            containsId = true;
        }
    });
    return containsId;
}

function containsGame(pGames, pId) {
    let containsId = false;
    pGames.forEach(function (game) {
        if (pId.toString() === game._id.toString()) {
            containsId = true;
        }
    });
    return containsId;
}

function getVisitWithId(pVisits, pId) {
    let returnVisit = null;
    pVisits.forEach(function (visit) {
        if (visit.location._id.toString() === pId.toString()) {
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