const objects = require("../mongodb/objects");
const ObjectID = require('mongodb').ObjectID;

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

function findLocationById(pEvent, pId) {
    let mappingItem = null;
    pEvent.locationMappings.forEach(function (locationMapping) {
        if (locationMapping.location._id.toString() === ObjectID(pId).toString()) {
            mappingItem = locationMapping;
        }
    });
    return mappingItem;
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
    },
    findLocationById
};