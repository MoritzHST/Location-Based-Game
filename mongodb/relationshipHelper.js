const operations = require('../mongodb/operations');

module.exports = {

    getUserWithRooms: function (pUserId) {
        operations.joinCollection("users", {
            $lookup: {
                "from": "rooms",
                "localField": "_id",
                "foreignField": "_id",
                "as": "rooms"
            }
        }, function (err, res) {
        	console.log(res);
        });
        
        
    	/*
        operations.joinCollection("users_rooms",
            [
                {"$match": {"user_id_id": pUserId}},
                // Do the lookup matching
                {
                    "$lookup": {
                        "from": "rooms",
                        "localField": "room_id", //"room_id.str",
                        "foreignField": "_id", //"_id.str",
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
            */
    }
};