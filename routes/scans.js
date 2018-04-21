const operations = require('../mongodb/operations');
const handler = require('../mongodb/handler');
const router = require('express').Router();

/* Global */

/* GET */
/* Find Room(s) */
router.get('/find/scan', function (req, res) {
    operations.findObject("rooms", (handler.checkIfValidQuery(req.query) ? req.query : null), function (err, item) {
        getMinigamesForRoom(item._id, function (minigames) {
            handler.dbResult(err, res,
                {
                    "room": item,
                    "minigames": minigames
                }
                , "Das Item " + JSON.stringify(req.query).replace(/\"/g, '') + " existiert nicht.");
        });
    });
});

function getMinigamesForRoom(pRoomId, pCallback) {
    operations.findObject(
        "minigames",
        {"room_id": pRoomId.toString()},
        function (err, item) {
            let stack = [];
            if (err || item === null || item === undefined) {
                pCallback(stack);
            } else {
                if (Array.isArray(item)) {
                    item.forEach(function (element) {
                        stack.push(element);
                    });
                } else {
                    stack.push(item);
                }
                pCallback(stack);
            }
        }
    );
}

module.exports = router;