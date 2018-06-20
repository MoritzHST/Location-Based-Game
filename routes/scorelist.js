const operations = require('../mongodb/operations');
const handler = require('../mongodb/handler');
const router = require('express').Router();
const logging = require('../helper/logging');
const userCollection = require('../mongodb/collections').USERS;
const scorelistHelper = require('../helper/scorelistHelper');

const errorMessage = "Fehler beim auslesen der Highscores";

const scorelistLength = 20;

/* Global */

/**
 * gibt alle dem Nutzer zur Verfügung stehenden Missionen zurück
 *
 */
router.get('/get/scorelist', async function (req, res) {
    logging.Entering("GET get/scorelist");
    operations.findObject(userCollection, null, function (err, items) {
        items.sort(function (a, b) {
            let compareResult = scorelistHelper.equalsInScore(a.score, b.score);
            if (compareResult !== 0) {
                return compareResult;
            }
            //gleicher score und gleich viele Spiele gespielt: sortiere nach Namen
            return (a.name > b.name) ? 1 : -1;
        });
        let place = 1;
        for (let index = 0; (index < items.length) && (index < scorelistLength); index++) {
            let item = items[index];
            item.token = undefined;
            item.visits = undefined;
            if (index !== 0 && scorelistHelper.equalsInScore(item.score, items[index - 1].score) === 0) {
                item.place = items[index - 1].place;
            } else {
                item.place = place;
            }
            place++;
        }
        handler.dbResult(err, res, items, errorMessage);
    });
    logging.Leaving("GET get/scorelist");
});

module.exports = router;