const operations = require('../mongodb/operations');

module.exports = {

    getUserWithRooms: function (pUserId) {
        operations.joinCollection("users_rooms",
            [
                {"$match": {"user_id": pUserId}},
                // Do the lookup matching
                {
                    "$lookup": {
                        "from": "rooms",
                        "localField": "room_id.str",
                        "foreignField": "_id.str",
                        "as": "rooms"
                    }
                },
                {
                    $unwind: "$locations"
                }
            ],
            function (err, res) {
                console.log(res);
            });
    }
};