const fs = require('fs');
const operations = require('../mongodb/operations');
const handler = require('../mongodb/handler');
const logging = require("../helper/logging");

module.exports = {

    deleteFile: function (pCollection, pId, pCallback) {
        logging.Entering("deleteFile");
        logging.Parameter("pCollection", pCollection);
        logging.Parameter("pId", pId);

        operations.findObject(
            pCollection,
            handler.idFriendlyQuery({"_id": pId.toString()}),
            function (err, item) {
                pCallback();
                if (item === null || item.image === null || item.image === undefined) {
                    logging.Leaving("deleteFile");
                    return;
                }
                fs.unlink("..\\public\\" + item.image, function () {
                });
            }
        );

        logging.Leaving("deleteFile");
    }

};