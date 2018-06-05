const operations = require('../mongodb/operations');
const objects = require('../mongodb/objects');
const eventsCollection = require('../mongodb/collections').EVENTS;

const noEventMessage = "Tut uns leid. Aktuell findet kein Event statt";

function getCurrentEvent() {
    return new Promise(resolve => {
            operations.findObject(eventsCollection, {"date": new Date().toJSON().slice(0, 10)}, function (err, item) {
                if (item) {
                    resolve(item);
                } else {
                    resolve(undefined);
                }
            });
        }
    );
}

function getMaxScore(pEvent) {
    let maxPoints = 0;
    let maxGames = 0;
    let maxLocations = 0;

    if (pEvent) {
        return null;
    }

    pEvent.locationMappings.forEach(function (locationMapping) {
        maxLocations += 1;
        locationMapping.games.forEach(function (game) {
            maxGames += 1;
            maxPoints += game.points;
        });
    });
    let maxScore = new objects.Score();
    maxScore.games = maxGames;
    maxScore.locations = maxLocations;
    maxScore.points = maxPoints;

    return maxScore;
}

function formatScoreObject(pEvent, pScore) {
    let maxScore = getMaxScore(pEvent);

    if (!maxScore) {
        return pScore;
    }

    maxScore.games = pScore.games + " / " + maxScore.games;
    maxScore.locations = pScore.locations + " / " + maxScore.locations;
    maxScore.points = pScore.points + " / " + maxScore.points;
    return maxScore;
}

module.exports = {
    getCurrentEvent: async function () {
        return await getCurrentEvent();
    },

    noEventMessage: noEventMessage,

    formatScoreObject
};