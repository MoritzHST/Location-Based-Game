const objects = require('../mongodb/objects');
const operations = require('../mongodb/operations');
const logging = require('../mongodb/logging');

const exampleRoom = require('./room');
const exampleQuiz = require('./quiz');

var exampleMapping = new objects.MinigameRoomMapping(null, exampleRoom, exampleQuiz);
var exampleMapping = new objects.MinigameRoomMapping(null, exampleRoom, exampleQuiz);

/**
 * 
 * @param err
 * @param res
 * @returns
 */
operations.updateObject("minigames_rooms", exampleMapping, null, function(err, result) {
    if (!err)
        logging.Info("Mapping Minigames-Rooms erstellt: " + result.value);
    else
        logging.Error(err);
});