const objects = require('./objects');
const operations = require('./operations');
const logging = require('./logging');

const test = require('./relationshipHelper');

var testUser = new objects.User("Harald");
var testAnswer = new objects.Answer("Obst", true);
var testAnswer2 = new objects.Answer("Gemüse", false);
var testQuiz = new objects.SimpleQuiz("Was ist eine Banane?", [testAnswer, testAnswer2]);
var testRoom = new objects.Room("103a", "Multimedia-Labor", "Hier werden Multimedia-Projekte durchgeführt...");
var testMinigameRoomMapping = new objects.MinigameRoomMapping(testRoom, testQuiz);
var testEventTemplate = new objects.EventTemplate("Tag der offenen Tür", testMinigameRoomMapping);

/**
 * Beispielaufruf: entfernt alle übergebenden Benutzer aus der Datenbank.
 * Wird null übergeben, werden alle benutzer gelöscht.
 */

operations.deleteObjects("users", null, function (err) {
    if (!err)
        logging.Info("Alle Benutzer gelöscht.");
    else
        logging.Error(err);
});

/**
 * Beispielaufruf: fügt einen User der Datenbank hinzu.
 * (In diesem Fall delayed um 2 Sekunden)
 */
setTimeout(function () {
    testUser["_id"]="aaaaaaaaaaaa";
    testRoom["_id"]="aaaaaaaaaaaa";
    operations.updateObject("users", testUser, null, function (err, result) {
        if (!err)
            logging.Info("Benutzer erstellt: " + result.value.name);
        else
            logging.Error(err);
    });
    operations.updateObject("rooms", testRoom, null, function (err, result) {
        if (!err)
            logging.Info("Raum erstellt: " + result.value.name);
        else
            logging.Error(err);
    });
    operations.updateObject("minigames", testQuiz, null, function (err, result) {
        if (!err)
            logging.Info("SimpleQuiz erstellt: " + result.value.name);
        else
            logging.Error(err);
    });
    operations.updateObject("users_rooms", {
        "user_id": "616161616161616161616161",
        "room_id": "616161616161616161616161"
    }, null, function (err, result) {
        test.test();
        if (!err)
            logging.Info("UsersRooms erstellt: " + result.value.name);
        else
            logging.Error(err);
    });
}, 2000);

/**
 * Beispielaufruf: Sucht nach allen Benutzern in der Datenbank und gibt diese zurück.
 */
operations.findObject("users", null, function (err, items) {
    if (!err)
        logging.Info("USERS: " + items);
    else
        logging.Error(err);
});

/**
 * Beispielaufruf: Sucht in der Datenbank nach einem Benutzer mit dem Namen 'Harald'
 * und gibt den ersten Treffer als Objekt zurück.
 */
operations.findObject("users", {name: 'Harald'}, function (err, item) {
    if (!err)
        logging.Info("HARALD: " + JSON.stringify(item));
    else
        logging.Error(err);
});

/**
 * Beispielaufruf: Sucht in der Datenbank nach allen Collections und gibt diese aus.
 */
operations.getCollection(null, function (err, collectionList) {
    if (!err)
        logging.Info(collectionList);
    else
        logging.Error(err);
});