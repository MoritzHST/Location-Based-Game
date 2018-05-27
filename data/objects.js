const objects = require('../mongodb/objects');
const collections = require('../mongodb/collections');

/**
 * Hilfsfunktion, die ein Game anhand seiner Id sucht.
 * @param pId Id des gesuchten Games. Id ist in diesem Fall der Index innerhalb der Liste
 * @returns {*} GameObjekt an der jeweiligen Position
 */
function getGameById(dbObjects, pId) {
    return dbObjects.get(collections.GAMES)[pId];
}

module.exports = {
		example: function() {
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
			    new objects.Exposition("Multimedia-Labor", "Hier werden Multimedia-Projekte durchgeführt...", undefined, ["https://www.hochschule-stralsund.de/fileadmin/hs-stralsund/_processed_/0/5/csm_Header_Softwareentwicklung_0d7a471182.jpg",
			        "https://www.hochschule-stralsund.de/fileadmin/hs-stralsund/_processed_/6/5/csm_Header_IT-Sicherheit_a349f746b3.jpg"]),
			    new objects.Exposition("Labor-Nr2", "Hier könnte ein Text stehen...", undefined, ["https://www.hochschule-stralsund.de/fileadmin/hs-stralsund/_processed_/0/5/csm_Header_Softwareentwicklung_0d7a471182.jpg",
			        "https://www.hochschule-stralsund.de/fileadmin/hs-stralsund/_processed_/6/5/csm_Header_IT-Sicherheit_a349f746b3.jpg"])]);
			// Games
			dbObjects.set(collections.GAMES, [ new objects.SimpleQuiz("Was ist eine Banane?", [ new objects.Answer("Obst", true), new objects.Answer("Gemüse", false), new objects.Answer("42", false), new objects.Answer("Nichts", false), new objects.Answer("Alles", false) ], 100),
			        new objects.SimpleQuiz("Was ist ein Hund?", [ new objects.Answer("Säugetier", true), new objects.Answer("Fisch", false) ], 100),
			        new objects.SimpleQuiz("Was ist OpenGL?", [ new objects.Answer("Grafikstandard", true), new objects.Answer("Grafik API", true), new objects.Answer("Treiber", false), new objects.Answer("Programmiersprache", false), new objects.Answer("Grafikkartenhersteller", false) ], 100),
			        new objects.SimpleQuiz("Welche Auflösung hat Full-HD?", [ new objects.Answer("1920 × 1080", true), new objects.Answer("800 x 600", false), new objects.Answer("1024 x 768", false), new objects.Answer("1280 x 800", false), new objects.Answer("1280 x 720", false) ], 100),
			        new objects.SimpleQuiz("Wo wurde die MP3 erfunden?", [ new objects.Answer("Deutschland", true), new objects.Answer("Holland", false), new objects.Answer("Schweiz", false), new objects.Answer("Amerika", false), new objects.Answer("Russland", false) ], 100),
			        new objects.SimpleQuiz("Was versteht man unter VR?", [ new objects.Answer("Virtuelle Realität", true), new objects.Answer("Virtual Reality", true), new objects.Answer("Vereinsregister", false), new objects.Answer("Virenreiniger", false), new objects.Answer("Vip Room", false) ], 100) ]);
			// LocationMapping
			dbObjects.set(collections.LOCATION_MAPPING, [ new objects.LocationMapping(dbObjects.get(collections.LOCATIONS)[0], dbObjects.get(collections.EXPOSITIONS)[0], [ getGameById(dbObjects,2), getGameById(dbObjects,5) ]),
			        new objects.LocationMapping(dbObjects.get(collections.LOCATIONS)[1], dbObjects.get(collections.EXPOSITIONS)[1], [ getGameById(dbObjects,3), getGameById(dbObjects,4) ]) ]);
			
			return dbObjects;
		}
}