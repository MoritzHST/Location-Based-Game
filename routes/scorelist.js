const operations = require('../mongodb/operations');
const handler = require('../mongodb/handler');
const router = require('express').Router();
const logging = require('../helper/logging');

const locationMappingCollection = require('../mongodb/collections').LOCATION_MAPPING;
const userCollection = require('../mongodb/collections').USERS;
const eventHelper = require('../helper/event');

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
            let ascore = a.score.score;
            let bscore = b.score.score;
            if (ascore < bscore) {
                return 1;
            }
            if (ascore > bscore) {
                return -1;
            }
            return a.name.localeCompare(b.name);
        });
        let place = 1;
        for (let index = 0; (index < items.length) && (index < scorelistLength); index++) {
            let item = items[index];
            item.token = undefined;
            item.visits = undefined;
            if (index !== 0 && item.score.score === items[index - 1].score.score) {
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