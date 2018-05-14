const operations = require('../mongodb/operations');
const handler = require('../mongodb/handler');
const router = require('express').Router();

const locationMappingCollection = require('../mongodb/collections').LOCATION_MAPPING;
const userCollection = require('../mongodb/collections').USERS;
const objects = require('../mongodb/objects');

const gameHelper = require('../helper/scan');

/* Global */

/* GET */
/* Find ScanResult(s) */
router.get('/find/scan', function (req, res) {
    let identifier = req.query.identifier;

    operations.findObject(locationMappingCollection,
        {
            "location.identifier": identifier
        }, function (err, item) {
            if (item !== null && item !== undefined) {
                item.games = gameHelper.prepareGames(item.games);

                operations.findObject(userCollection, req.session.user, function (userErr, userItem) {
                    if (!userErr && userItem !== null && userItem !== undefined) {
                        if (gameHelper.hasAlreadyVisited(userItem, item.location)) {
                            item.games = gameHelper.addGameStates(userItem.visits, item.games, item.location._id);
                        } else {
                            if (userItem.visits === undefined) {
                                userItem.visits = [];
                            }
                            userItem.visits.push(new objects.Visit(item, [], false, objects.RoomStates.VISITED));
                            operations.updateObject(userCollection,
                                handler.idFriendlyQuery({
                                    _id: userItem._id
                                }),
                                userItem, function () {
                                });
                        }
                    } else {
                        //behandle error
                    }
                });
            }
            handler.dbResult(err, res, item, "Zu diesem Code konnten leider keine Minispiele gefunden werden. Tut uns Leid. Really, we are sorry :(");
        });
});


module.exports = router;