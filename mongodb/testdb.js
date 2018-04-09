const objects = require('./objects');
const operations = require('./operations');

var testUser = new objects.User("Harald");
var testQuiz = new objects.Quiz("Was ist eine Banane?", "Obst", "Gemüse");
var testRoom = new objects.Room("103a", "Multimedia-Labor");
var testMinigameRoomMapping = new objects.MinigameRoomMapping(testRoom, testQuiz);
var testEventTemplate = new objects.EventTemplate("Tag der offenen Tür", testMinigameRoomMapping);

/**
 * Beispielaufruf: entfernt alle übergebenden Benutzer aus der Datenbank.
 * In diesem Fall alle Benutzer mit den Namen Harald.
 */

operations.deleteObjects("users", {name: 'Harald'}, function (result) {
    console.log(result.n + " Objekte gelöscht.");
});

/**
 * Beispielaufruf: fügt einen User der Datenbank hinzu.
 * (In diesem Fall delayed um 2 Sekunden)
 */
setTimeout(function () {
    operations.updateObject("users", testUser, null, function (result) {
        console.log("Benutzer erstellt: " + result.value.name);
    });
}, 2000);

/**
 * Beispielaufruf: Sucht nach allen Benutzern in der Datenbank und gibt diese zurück.
 */
operations.findAllObjects("users", function (items) {
    console.log("USERS: " + items);
});

/**
 * Beispielaufruf: Sucht in der Datenbank nach einem Benutzer mit dem Namen 'Harald'
 * und gibt den ersten Treffer als Objekt zurück.
 */
operations.findObject("users", {name: 'Harald'}, function (item) {
    console.log("HARALD: " + JSON.stringify(item));
});

/**
 * Beispielaufruf: Sucht in der Datenbank nach allen Collections und gibt diese aus.
 */
operations.getCollection(null, function (collectionList) {
    console.log(collectionList);
});