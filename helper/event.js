const operations = require('../mongodb/operations');
const objects = require('../mongodb/objects');
const eventsCollection = require('../mongodb/collections').EVENTS;

const noEventMessage = "Tut uns leid. Aktuell findet kein Event statt";

/**
 * Asynchrone Funktion, die Ein Promise mit dem aktuell laufenden Event zurück gibt.
 * Sollte aktuell kein Event stattfinden enthält das Promise undefined
 * @returns {Promise<any>}
 */
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

/**
 * Berechnet für das übergebene Event-Objekt die maximal erreichbaren Punkte/Spiele/Locations und gibt diese als ein Score Objekt zurück.
 * Ist das Event nicht gesetzt, so wird null zurück gegeben.
 * @param pEvent Event-Objekt, für das der Maximale Score berechnet werden soll.
 * @returns {*}
 */
function getMaxScore(pEvent) {
    if (!pEvent) {
        return null;
    }

    let maxScore = 0;
    let maxGames = 0;
    let maxLocations = 0;

    pEvent.locationMappings.forEach(function (locationMapping) {
        maxLocations += 1;
        locationMapping.games.forEach(function (game) {
            maxGames += 1;
            maxScore += game.points;
        });
    });
    let maxScoreObject = new objects.Score();
    maxScoreObject.games = maxGames;
    maxScoreObject.locations = maxLocations;
    maxScoreObject.score = maxScore;

    return maxScoreObject;
}

function formatScoreObject(pEvent, pScore) {
    let maxScore = getMaxScore(pEvent);

    if (!maxScore) {
        return pScore;
    }
    let returnScore = {};
    returnScore.games = pScore.games + " / " + maxScore.games;
    returnScore.locations = pScore.locations + " / " + maxScore.locations;
    returnScore.score = pScore.score + " / " + maxScore.score;
    return returnScore;
}

module.exports = {
    getCurrentEvent: async function () {
        return await getCurrentEvent();
    },

    noEventMessage: noEventMessage,

    formatScoreObject
};