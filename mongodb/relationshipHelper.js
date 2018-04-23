const operations = require('../mongodb/operations');
const handler = require('../mongodb/handler');


function getRoomById(pRoomId, pCallback) {
    operations.findObject("rooms", {"_id": pRoomId.toString()}, function (err, item) {
        if (item !== null && item !== undefined) {
            pCallback(null, item);
        } else {
            pCallback(err);
        }
    });
}

function getMinigameById(pMiniGameId, pCallback) {
    operations.findObject("minigames", {"_id": pMiniGameId.toString()}, function (err, item) {
        if (item !== null && item !== undefined) {
            pCallback(null, item);
        } else {
            pCallback(err);
        }
    });
}

module.exports = {

    test: function () {
        operations.joinCollection("users_rooms",
            [
                // Do the lookup matching
                {
                    "$lookup": {
                        "from": "users",
                        "localField": "user_id",
                        "foreignField": "_id",
                        "as": "userlist"
                    }
                }
            ],
            function (err, res) {
                console.log(res);
            });
    }
    /*
    getMinigamesByRoom: function (pRoomId, pCallback) {
        operations.findObject("rooms", {"room_id": pRoomId.toString()}, function (err, item) {
            if (item !== null && item !== undefined) {
                var stack = [];

                if (Array.isArray(item)) {
                    item.forEach(function () {
                        getRoomById(item.room_id,function (errRoom, itemRoom) {
                            if( itemRoom !== null && itemRoom !== undefined ){
                                getMinigameById(item.minigame_id, function (errMinigame, itemMinigame) {
                                    if(itemMinigame !== null && itemMinigame !== undefined){
                                        itemRoom["minigames"]
                                    }
                                });
                            }
                        });
                    });
                } else {

                }
            } else {
                pCallback(err, null);
            }
        });
    }
*/
};