const operations = require('../mongodb/operations');
const handler = require('../mongodb/handler');
const router = require('express').Router();

const locationMappingCollection = require('../mongodb/collections').LOCATION_MAPPING;
const userCollection = require('../mongodb/collections').USERS;
const objects = require('../mongodb/objects');

Array.prototype.shuffle = function () {
    var input = this;
    for (var i = input.length - 1; i >= 0; i--) {
        var randomIndex = Math.floor(Math.random() * (i + 1));
        var itemAtIndex = input[randomIndex];

        input[randomIndex] = input[i];
        input[i] = itemAtIndex;
    }
    return input;
};

/* Global */

/* GET */
/* Find ScanResult(s) */
router.get('/find/scan', function (req, res) {
    let identifier = req.query.identifier;
    operations.findObject(locationMappingCollection,
        {
            "location.identifier": identifier
        }, function (err, item) {
            if (item !== null && item !== undefined) {

                var games = [];

                item.games.forEach(function (game) {
                    //Baue Antworten für für Fragen zusammen
                    var maxCorrectAnswers;
                    var maxAnswers = 4;
                    var outputCorrectAnswers = [];
                    var outputIncorrectAnswers = [];

                    if (game.type === objects.Type.SINGLE_CHOICE) {
                        maxCorrectAnswers = 1;
                    } else {
                        maxCorrectAnswers = 4;
                    }

                    game.answers.shuffle().forEach(function (answer) {
                            let currentSize = (outputIncorrectAnswers.length + outputCorrectAnswers.length);
                            if (currentSize === maxAnswers) {
                                return
                            }
                            if (answer.isCorrect && outputCorrectAnswers.length < maxCorrectAnswers && currentSize < maxAnswers) {
                                answer.isCorrect = undefined;
                                outputCorrectAnswers.push(answer);
                                return;
                            }
                            if (!answer.isCorrect && currentSize < maxAnswers) {
                                answer.isCorrect = undefined;
                                outputIncorrectAnswers.push(answer);
                            }
                        }
                    );
                    if (outputCorrectAnswers.length > 0) {
                        //Mindestens eine richtige Antwort vorhanden
                        //Sende array zurück
                        game.answers = outputCorrectAnswers.concat(outputIncorrectAnswers).shuffle();
                        games.push(game);
                    }

                })
            }
            /*
            operations.findObject(userCollection, req.session.user, function (userErr, userItem) {
                if (!userErr && userItem !== null && userItem !== undefined) {
                    if (userItem.visits.includes(items)) {
                        //Nutzer war schon an diesem Ort


                    } else {
                        //Nutzer war noch nicht an dieser Location
                        userItem.visits.push(item);
                    }
                } else {
                    //handle error
                }
            });
            */
            handler.dbResult(err, res, item, "Zu diesem Code konnten leider keine Minispiele gefunden werden. Tut uns Leid. Really, we are sorry :(");
        });
});

module.exports = router;