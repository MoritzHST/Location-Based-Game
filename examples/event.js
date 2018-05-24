const objects = require('../mongodb/objects');
const operations = require('../mongodb/operations');
const logging = require('../helper/logging');
const collections = require('../mongodb/collections');

var exampleEvent = new objects.Event("TestEvent", String(new Date().toJSON().slice(0, 10)));
module.exports = exampleEvent;

/**
 * 
 * @returns
 */
setTimeout(function() {
    operations.updateObject(collections.EVENTS, exampleEvent, null, function(err, result) {
        if (!err)
            logging.Info("Event erstellt: " + result.value.name);
        else
            logging.Error(err);
    });
}, 2000);