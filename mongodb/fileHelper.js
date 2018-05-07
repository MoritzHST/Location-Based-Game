const fs = require('fs');
const operations = require('../mongodb/operations');
const handler = require('../mongodb/handler');

module.exports = {

    deleteFile: function (pCollection, pId, pCallback) {
        operations.findObject(
            pCollection,
            handler.idFriendlyQuery({"_id": pId.toString()}),
            function (err, item) {
                pCallback();
                if (item === null || item.image === null || item.image === undefined) {
                    return;
                }
                fs.unlink("..\\public\\" + item.image, function () { });
            }
        );
    }

};