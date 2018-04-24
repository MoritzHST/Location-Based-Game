const objects = require('../mongodb/objects');
const operations = require('../mongodb/operations');
const logging = require('../mongodb/logging');

var exampleQuiz = new objects.SimpleQuiz("Was ist eine Banane?", [
	new objects.Answer("Obst", true), 
	new objects.Answer("Gemüse", false)
]);

module.exports = exampleQuiz;

/**
 * 
 * @param err
 * @param result
 * @returns
 */
operations.updateObject("minigames", exampleQuiz, null, function (err, result) {
    if (!err)
        logging.Info("SimpleQuiz erstellt: " + result.value.name);
    else
        logging.Error(err);
});

operations.updateObject("minigames", exampleQuiz, null, function (err, result) {
    if (!err)
        logging.Info("SimpleQuiz erstellt: " + result.value.name);
    else
        logging.Error(err);
});