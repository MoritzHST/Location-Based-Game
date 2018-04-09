/** Benötigte Variablen */
var MongoClient = require('mongodb').MongoClient;

var http = require('http');

var databaseUrl = "mongodb://localhost:27017/";

var databaseName = "LocationBasedGame";

/** node js start */
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('plain page');

    initDatabase();

    var testUser = new User("Harald");
    var testQuiz = new Quiz("Was ist eine Banane?", "Obst", "Gemüse");
    var testRoom = new Room("103a", "Multimedia-Labor");
    var testMinigameRoomMapping = new MinigameRoomMapping(testRoom, testQuiz);
    var testEventTemplate = new EventTemplate("Tag der offenen Tür", testMinigameRoomMapping);


    insertObject("users", testUser);
    readObject("users", 123)

}).listen(8080);

/**
 * Beim starten der Anwendung muss es eine Art Template geben, für welches
 * hinterlegt ist, welche Räume mit welchen Fragen aktiv sind
 *
 * pName -> Name des Events (Tag der offenen Tür, Girls Day...)
 * pMinigameRoomMapping -> vom Typ MinigameRoomMapping, hinterlegt welcher Raum
 *                         welches Minigame hat
 */

function EventTemplate(pName, pMinigameRoomMapping) {
    logInfo("initializing new EventTemplate");
    logParameter("pName", pName);
    logParameter("pMinigameRoomMapping", pMinigameRoomMapping);
    this.name = pName;
    this.minigameRoomMappings = pMinigameRoomMapping;
    logInfo("initializing EventTemplate done")
}

/**
 * Für unterschiedliche Räume können unterschiedliche Minigames aktiv sein, es
 * muss also möglich sein, diese flexibel zu mappen
 *
 * pRoom -> vom Typ Room, hinterlegt ein Raumobjekt
 * pMinigame -> vom Typ eines Minigames (Quiz, ...), hinterlegt ein Minigameobjekt
 */

function MinigameRoomMapping(pRoom, pMinigame) {
    logInfo("initializing new MinigameRoomMapping")
    logParameter("pRoom", pRoom);
    logParameter("pMinigame", pMinigame);
    this.room = pRoom;
    this.minigame = pMinigame;
    logInfo("initializing MinigameRoomMapping done");
}

/**
 * Minigames sollten flexibel sein, das heißt es müssen unterschiedliche Objekte
 * für unterschiedliche Minigames existieren.
 *******************************************************************************
 * Ein Quiz besteht aus einer Frage und einer Antwort, es ist sinnvoll auf
 * Datenebene die Richtige von den falschen Antworten zu trennen
 *
 * pQuestion -> die Frage als String
 * pRightAnswer -> die richtige Antwort auf die Frage als String
 * pWrongAnswer -> die falschen Antworten auf die Frage als Strings
 */

function Quiz(pQuestion, pRightAnswer, pWrongAnswer) {
    logInfo("initializing new Quiz");
    logParameter("pQuestion", pQuestion);
    logParameter("pRightAnswer", pRightAnswer);
    logParameter("pWrongAnswer", pWrongAnswer);
    this.type = "quiz";
    this.question = pQuestion;
    this.rightAnswer = pRightAnswer;
    this.wrongAnswer = pWrongAnswer;
    logInfo("initializing Quiz done");
}

/**
 * Erzeugt ein Userobjekt bestehend aus Usernamen und einem Sessiontoken
 *
 * pUsername -> Username des Users als String
 */
function User(pUsername) {
    logInfo("initializing new User");
    logParameter("pUsername", pUsername);
    this.name = pUsername;
    this.token = generateToken();
    logInfo("initializing User done");
}

/**
 * Erzeugt ein neues Raumobjekt bestehend aus Raumnummer und optionalem Usernamen
 *
 * pRoomnumber -> Nummer des Raums als String
 * pName -> Name des Raumes
 */
function Room(pRoomnumber, pName) {
    logInfo("initializing new Room");
    logParameter("pRoomnumber", pRoomnumber);
    logParameter("pName", pName);
    this.roomnumber = pRoomnumber;
    this.name = pName;
    logInfo("initializing Room done");
}

/**
 * Generiert ein Sessiontoken.
 */
function generateToken() {
    var returnObj = ('' + Math.floor(Math.random() * 10000)).padStart(4, "0");
    logInfo("Token " + returnObj + " generated");
    return returnObj;
}

/**
 * Initialisiert die einzelnen Collections der MongoDB
 */
function initDatabase() {
    MongoClient.connect(databaseUrl, function (err, db) {
        if (err) {
            logError(err);
        }
        var dbo = db.db(databaseName);
        createCollection(dbo, "minigames_rooms");
        createCollection(dbo, "rooms");
        createCollection(dbo, "users");
        createCollection(dbo, "minigames");
        createCollection(dbo, "templates");

        db.close();
    });
}

/**
 * erzeugt eine neue MongoDB-Collection, falls es diese noch nicht gibt
 *
 * pDatabaseObject -> DatenbankObjekt (Mit Datenbanknamen)
 */
function createCollection(pDatabaseObject, pCollection) {
    if (pDatabaseObject.collection(pCollection) == undefined) {
        pDatabaseObject.createCollection(pCollection, function (err, res) {
            if (err) {
                logError(err);
            }
            console.log("Collection " + pCollection + " created")
        })
    }
}

/**
 * Fügt pObject in die Collection pCollection der MongoDB ein
 */
function insertObject(pCollection, pObject) {
    MongoClient.connect(databaseUrl, function (err, db) {
        if (err) throw err;
        var dbo = db.db(databaseName);

        dbo.collection(pCollection).insertOne(pObject, function (err, res) {
            if (err) {
                throw logError(err);
            }
            logInfo(pObject + " in " + pCollection + " eingefügt");
            db.close();
            return pObject;
        });
    });

}

function readObject(pCollection, pKey) {
    MongoClient.connect(databaseUrl, function (err, db) {
        if (err) throw err;
        var dbo = db.db(databaseName);
        dbo.collection(pCollection).findOne({_id: pKey}, function (err, result) {
            if (err) throw err;
            db.close();
            return result;
        });
    });

}

function updateObject(pCollection, pKey, pObject) {
    //return obj;
}

/**
 * Entfernt Objekt aus der Collection pCollection
 *
 * return true, wenn löschen erfolgreich
 *        false, wenn löschen nicht erfolgreich
 */
function deleteObject(pCollection, pKey) {

}

function logInfo(pInfomessage) {
    console.log("[INFO] " + pInfomessage);
}

function logError(pErrormessage) {
    console.log("[ERROR] " + pErrormessage);
}

function logParameter(pParameterName, pParameterValue) {
    console.log("[PARAMETER] " + pParameterName + " -> " + pParameterValue);
}
