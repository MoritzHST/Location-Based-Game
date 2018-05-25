const operations = require('../mongodb/operations');
const eventsCollection = require('../mongodb/collections').EVENTS;

const noEventMessage = "Tut uns leid. Aktuell findet kein Event statt";

function isEventActive() {
    return new Promise(resolve => {
            operations.findObject(eventsCollection, {"date": new Date().toJSON().slice(0, 10)}, function (err, item) {
                if (item) {
                    resolve(true);
                    console.log(item);
                } else {
                    resolve(false);
                }
            });
        }
    );
}

module.exports = {
    isEventActive: async function () {
        return await isEventActive();
    },

    noEventMessage: noEventMessage
};