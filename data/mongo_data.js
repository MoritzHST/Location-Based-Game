const collections = require('../mongodb/collections');
const objects = require('../mongodb/objects');
const operations = require('../mongodb/operations');
const logging = require('../helper/logging');

let dbObjects = new Map();

//User
dbObjects.set(
    collections.USERS,
    [
        new objects.User("Harald")
    ]
);
//Locations
dbObjects.set(
    collections.LOCATIONS,
    [
        new objects.Location("103a", "http://qr.service.fh-stralsund.de/h4r314"),
        new objects.Location("323", "http://qr.service.fh-stralsund.de/h4r323")
    ]
);
//Expositions
dbObjects.set(
    collections.EXPOSITIONS,
    [
        new objects.Exposition("Multimedia-Labor", "Hier werden Multimedia-Projekte durchgeführt...", undefined),
        new objects.Exposition("Labor-Nr2", "Hier könnte ein Text stehen...", undefined)
    ]
);
//Games
dbObjects.set(
    collections.GAMES,
    [
        new objects.SimpleQuiz("Was ist eine Banane?", [new objects.Answer("Obst", true), new objects.Answer("Gemüse", false), new objects.Answer("42", false), new objects.Answer("Nichts", false), new objects.Answer("Alles", false)], 100),
        new objects.SimpleQuiz("Was ist ein Hund?", [new objects.Answer("Säugetier", true), new objects.Answer("Fisch", false)], 100),
        new objects.SimpleQuiz("Was ist OpenGL?", [new objects.Answer("Grafikstandard", true), new objects.Answer("Grafik API", true), new objects.Answer("Treiber", false), new objects.Answer("Programmiersprache", false), new objects.Answer("Grafikkartenhersteller", false)], 100),
        new objects.SimpleQuiz("Welche Auflösung hat Full-HD?", [new objects.Answer("1920 × 1080", true), new objects.Answer("800 x 600", false), new objects.Answer("1024 x 768", false), new objects.Answer("1280 x 800", false), new objects.Answer("1280 x 720", false)], 100),
        new objects.SimpleQuiz("Wo wurde die MP3 erfunden?", [new objects.Answer("Deutschland", true), new objects.Answer("Holland", false), new objects.Answer("Schweiz", false), new objects.Answer("Amerika", false), new objects.Answer("Russland", false)], 100),
        new objects.SimpleQuiz("Was versteht man unter VR?", [new objects.Answer("Virtuelle Realität", true), new objects.Answer("Virtual Reality", true), new objects.Answer("Vereinsregister", false), new objects.Answer("Virenreiniger", false), new objects.Answer("Vip Room", false)], 100)
    ]
);
//LocationMapping
dbObjects.set(
    collections.LOCATION_MAPPING,
    [
        new objects.LocationMapping(dbObjects.get(collections.LOCATIONS)[0], dbObjects.get(collections.EXPOSITIONS)[0],
            [
                getGameById(2),
                getGameById(5)
            ]
        ),
        new objects.LocationMapping(dbObjects.get(collections.LOCATIONS)[1], dbObjects.get(collections.EXPOSITIONS)[1],
            [
                getGameById(3),
                getGameById(4)
            ]
        )
    ]
);

function getGameById(pId) {
    return dbObjects.get(collections.GAMES)[pId];
}

//Gibt eine zufällige GUID zurück, die in Mongo verwendet werden kann
function addRandomGUID(pObject) {
    function getRandomId() {
        let id = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (let i = 0; i < 12; i++)
            id += possible.charAt(Math.floor(Math.random() * possible.length));

        return id;
    }

    pObject._id = getRandomId();
    logging.Info("_id: " + pObject._id);
    return pObject;
}

function insertIntoDatabase() {
    for (let collection of dbObjects.keys()) {
        let objects = dbObjects.get(collection);
        objects.forEach(function (object) {
                operations.findObject(collection, object, function (err, item) {
                    if (!item || err) {
                        object = addRandomGUID(object);
                        operations.updateObject(collection, object, null, function (err, result) {
                            if (!err)
                                logging.Info(collections + " erstellt: " + result.value._id);
                            else
                                logging.Error(err);
                        });
                    }
                });
            }
        );
    }
}

insertIntoDatabase();