const objects = require("../mongodb/objects");
const logging = require("./logging");
const ObjectID = require('mongodb').ObjectID;

/**
 * Handled das Singlechoice-Quiz
 * @param pAnswer
 * @param pGame
 * @returns {boolean}
 */
function singleChoiceHandler(pAnswer, pGame) {
    logging.Entering("singleChoiceHandler");
    logging.Parameter("pAnswer", pAnswer);
    logging.Parameter("pGame", pGame);

    for (let i in pGame.answers) {
        if (pGame.answers.hasOwnProperty(i) && pGame.answers[i].answer === pAnswer && pGame.answers[i].isCorrect) {
            return true;
        }
    }
    logging.Leaving("singleChoiceHandler");
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
        logging.Entering("checkAnswer");
        logging.Parameter("pAnswer", pAnswer);
        logging.Parameter("pGame", pGame);

        switch (pGame.type) {
            case objects.Type.SINGLE_CHOICE.type:
                logging.Info("Case SINGLE_CHOICE");
                logging.Leaving("checkAnswer");
                return singleChoiceHandler(pAnswer, pGame);
            case objects.Type.MULTIPLE_CHOICE.type:
                logging.Info("Case MULTIPLE_CHOICE");
                logging.Leaving("checkAnswer");
                return multipleChoiceHandler(pAnswer, pGame);
            default:
                logging.Info("Case DEFAULT");
                logging.Leaving("checkAnswer");
                return false;
        }
    },
    findLocationById
};