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
    }
};