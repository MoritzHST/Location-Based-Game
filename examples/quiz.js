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

let exampleQuiz3 = new objects.SimpleQuiz("Was ist OpenGL?", [
    new objects.Answer("Grafikstandard", true),
    new objects.Answer("Grafik API", true),
    new objects.Answer("Treiber", false),
    new objects.Answer("Programmiersprache", false),
    new objects.Answer("Grafikkartenhersteller", false)
], 100);
exampleQuiz3._id = "cccccccccccc";

let exampleQuiz4 = new objects.SimpleQuiz("Welche Auflösung hat Full-HD?", [
    new objects.Answer("1920 × 1080", true),
    new objects.Answer("800 x 600", false),
    new objects.Answer("1024 x 768", false),
    new objects.Answer("1280 x 800", false),
    new objects.Answer("1280 x 720", false)
], 100);
exampleQuiz4._id = "dddddddddddd";

let exampleQuiz5 = new objects.SimpleQuiz("Wo wurde die MP3 erfunden?", [
    new objects.Answer("Deutschland", true),
    new objects.Answer("Holland", false),
    new objects.Answer("Schweiz", false),
    new objects.Answer("Amerika", false),
    new objects.Answer("Russland", false)
], 100);
exampleQuiz5._id = "eeeeeeeeeeee";

let exampleQuiz6 = new objects.SimpleQuiz("Was versteht man unter VR?", [
    new objects.Answer("Virtuelle Realität", true),
    new objects.Answer("Virtual Reality", true),
    new objects.Answer("Vereinsregister", false),
    new objects.Answer("Virenreiniger", false),
    new objects.Answer("Vip Room", false)
], 100);
exampleQuiz6._id = "ffffffffffff";


module.exports = {
    exampleQuiz: [exampleQuiz, exampleQuiz2],
    exampleQuiz2: [exampleQuiz3, exampleQuiz6],
    exampleQuiz3: [exampleQuiz4, exampleQuiz5]
};

/**
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

operations.updateObject(collections.GAMES, exampleQuiz3, null, function (err) {
    if (!err)
        logging.Info("SimpleQuiz3 erstellt");
    else
        logging.Error(err);
});
operations.updateObject(collections.GAMES, exampleQuiz4, null, function (err) {
    if (!err)
        logging.Info("SimpleQuiz4 erstellt");
    else
        logging.Error(err);
});
operations.updateObject(collections.GAMES, exampleQuiz5, null, function (err) {
    if (!err)
        logging.Info("SimpleQuiz5 erstellt");
    else
        logging.Error(err);
});
operations.updateObject(collections.GAMES, exampleQuiz6, null, function (err) {
    if (!err)
        logging.Info("SimpleQuiz6 erstellt");
    else
        logging.Error(err);
});