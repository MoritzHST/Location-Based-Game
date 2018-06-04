const operations = require('../mongodb/operations');
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

module.exports = {
    getCurrentEvent: async function () {
        return await getCurrentEvent();
    },

    noEventMessage: noEventMessage
};