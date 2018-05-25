const objects = require('../mongodb/objects');
const collections = require('../mongodb/collections');

/**
 * Map, die eine Liste an Objekten auf ihren jeweiligen Collection-String mappt.
 * @type {Map<String, Array<any>>}
 */
let dbObjects = new Map();

// User
dbObjects.set(collections.USERS, [ new objects.User("Harald") ]);
// Locations
dbObjects.set(collections.LOCATIONS, [ new objects.Location("103a", "http://qr.service.fh-stralsund.de/h4r314"), new objects.Location("323", "http://qr.service.fh-stralsund.de/h4r323") ]);
// Expositions
dbObjects.set(collections.EXPOSITIONS, [
        new objects.Exposition("Multimedia-Labor", "Hier werden Multimedia-Projekte durchgeführt...", undefined, [ "https://dairygood.org/~/media/shared/content/2016/american.jpg?la=en&hash=1685F3618F75800B4DCBC59BE336C98F2CC4A44D",
                "https://dairygood.org/~/media/shared/content/2016/asiago.jpg?h=400&w=400&la=en&hash=BA75313FB12941C8509AD9948EF48AA89397DE3B", "https://dairygood.org/~/media/shared/content/2016/blue.jpg?la=en&hash=6195C67A1A12C959639329AE4CAFAB7ABC08A4C7" ]),
        new objects.Exposition("Labor-Nr2", "Hier könnte ein Text stehen...", undefined, [ "https://dairygood.org/~/media/shared/content/2016/bocconcini.jpg?la=en&hash=16A28E76097E8F3B864B04BF13115EDE13FCA53C",
                "https://dairygood.org/~/media/shared/content/2016/brie.jpg?la=en&hash=9ACD4902A5DE5F35C834EEE2254B64F85D3F2E29", "https://dairygood.org/~/media/shared/content/2016/burrata.jpg?la=en&hash=65310608CF3B9D4BE1FB0455BE119962A06CB55A",
                "https://dairygood.org/~/media/shared/content/2016/camembert.jpg?la=en&hash=8F02607CEFF81F7F1B719D7B8B8AB7DD590D2C79", "https://dairygood.org/~/media/shared/content/2016/cheddar.jpg?la=en&hash=8B87A668AE0C5A77F92A036270F120B71BC29177",
                "https://dairygood.org/~/media/shared/content/2016/cheesecurds.jpg?la=en&hash=1B3661FC29BEA82C716B0E530C294932B9C2EABA" ]) ]);
// Games
dbObjects.set(collections.GAMES, [ new objects.SimpleQuiz("Was ist eine Banane?", [ new objects.Answer("Obst", true), new objects.Answer("Gemüse", false), new objects.Answer("42", false), new objects.Answer("Nichts", false), new objects.Answer("Alles", false) ], 100),
        new objects.SimpleQuiz("Was ist ein Hund?", [ new objects.Answer("Säugetier", true), new objects.Answer("Fisch", false) ], 100),
        new objects.SimpleQuiz("Was ist OpenGL?", [ new objects.Answer("Grafikstandard", true), new objects.Answer("Grafik API", true), new objects.Answer("Treiber", false), new objects.Answer("Programmiersprache", false), new objects.Answer("Grafikkartenhersteller", false) ], 100),
        new objects.SimpleQuiz("Welche Auflösung hat Full-HD?", [ new objects.Answer("1920 × 1080", true), new objects.Answer("800 x 600", false), new objects.Answer("1024 x 768", false), new objects.Answer("1280 x 800", false), new objects.Answer("1280 x 720", false) ], 100),
        new objects.SimpleQuiz("Wo wurde die MP3 erfunden?", [ new objects.Answer("Deutschland", true), new objects.Answer("Holland", false), new objects.Answer("Schweiz", false), new objects.Answer("Amerika", false), new objects.Answer("Russland", false) ], 100),
        new objects.SimpleQuiz("Was versteht man unter VR?", [ new objects.Answer("Virtuelle Realität", true), new objects.Answer("Virtual Reality", true), new objects.Answer("Vereinsregister", false), new objects.Answer("Virenreiniger", false), new objects.Answer("Vip Room", false) ], 100) ]);
// LocationMapping
dbObjects.set(collections.LOCATION_MAPPING, [ new objects.LocationMapping(dbObjects.get(collections.LOCATIONS)[0], dbObjects.get(collections.EXPOSITIONS)[0], [ getGameById(2), getGameById(5) ]),
        new objects.LocationMapping(dbObjects.get(collections.LOCATIONS)[1], dbObjects.get(collections.EXPOSITIONS)[1], [ getGameById(3), getGameById(4) ]) ]);

/**
 * Hilfsfunktion, die ein Game anhand seiner Id sucht.
 * @param pId Id des gesuchten Games. Id ist in diesem Fall der Index innerhalb der Liste
 * @returns {*} GameObjekt an der jeweiligen Position
 */
function getGameById(pId) {
    return dbObjects.get(collections.GAMES)[pId];
}

module.exports = dbObjects;