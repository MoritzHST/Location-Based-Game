const objects = require("../mongodb/objects");


/**
 * Handled das Singlechoice-Quiz
 * @param pAnswer
 * @param pGame
 * @returns {boolean}
 */
function singleChoiceHandler(pAnswer, pGame) {
    for (let i in pGame.answers) {
        if (pGame.answers.hasOwnProperty(i) && pGame.answers[i].answer === pAnswer && pGame.answers[i].isCorrect) {
            return true;
        }
    }
}

function multipleChoiceHandler(pAnswer, pGame) {
    return false;
}

/**
 * Prüft, ob das Antwortobjekt korrekt für das Spiel ist
 * @type {{checkAnswer: boolean}}
 */
module.exports = {
    checkAnswer: function (pAnswer, pGame) {
        switch (pGame.type) {
            case objects.Type.SINGLE_CHOICE:
                return singleChoiceHandler(pAnswer, pGame);
            case objects.Type.MULTIPLE_CHOICE:
                return multipleChoiceHandler(pAnswer, pGame);
            default:
                return false;
        }
    }
};