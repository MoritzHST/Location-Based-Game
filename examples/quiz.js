const objects = require('../mongodb/objects');
const operations = require('../mongodb/operations');
const logging = require('../mongodb/logging');
const collections = require('../mongodb/collections');

let exampleQuiz = new objects.SimpleQuiz("Was ist eine Banane?", [
    new objects.Answer("Obst", true),
    new objects.Answer("Gemüse", false),
    new objects.Answer("42", false),
    new objects.Answer("Nichts", false),
    new objects.Answer("Alles", false)
], 100);
exampleQuiz._id = "aaaaaaaaaaaa";
let exampleQuiz2 = new objects.SimpleQuiz("Was ist ein Hund?", [
    new objects.Answer("Säugetier", true),
    new objects.Answer("Fisch", false)
], 100);
exampleQuiz2._id = "bbbbbbbbbbbb";

module.exports = [exampleQuiz, exampleQuiz2];

/**
 * 
 * @param err
 * @param result
 * @returns
 */
operations.updateObject(collections.GAMES, exampleQuiz, null, function (err) {
    if (!err)
        logging.Info("SimpleQuiz erstellt");
    else
        logging.Error(err);
});

operations.updateObject(collections.GAMES, exampleQuiz2, null, function (err) {
    if (!err)
        logging.Info("SimpleQuiz2 erstellt");
    else
        logging.Error(err);
});