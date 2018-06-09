const logging = require('../helper/logging');
const operations = require('./operations');
require('../public/javascripts/shared/game-context.js');

function Score() { // NOSONAR
    this.score = 0;
    this.games = 0;
    this.locations = 0;
}

module.exports = {

    /**
     * Enum, welches die verschiedenen Game-Typen symbolisiert
     */
    Type : Game,

    /**
     * Enum, welches die möglichen Status eines Raumes symbolisiert(bsp.: VISITED, COMPLETED, FLAWLESS)
     */
    RoomStates : RoomStates,

    /**
     * Enum, welches die verschiedenen Abschluss-Status eines Spiels symbolisiert(bsp.: UNPLAYER, CORRECT, WRONG)
     */
    GameStates : GameStates,

    /**
     * Event-Objekt bestehend aus Eventnamen und Gültigkeitsdatum. Ein Event gilt immer nur für einen Tag
     * @param pEventName Name des Events als String
     * @param pDate Datum an dem dieses Event stattfindet als String der Form("YYYY-MM-DD")
     * @param pLocationMappings Array aller LocationMappings-Objekte die an diesem Event freigeschaltet sind
     * @constructor
     */
    Event: function (pEventName, pDate, pLocationMappings) { // NOSONAR
        logging.Info("initializing new Event");
        logging.Parameter("pEventName", pEventName);
        logging.Parameter("pDate", pDate);
        logging.Parameter("pLocationMappings", pLocationMappings);
        this.name = pEventName;
        this.date = pDate;
        this.locationMappings = pLocationMappings;
        logging.Info("initializing Event done");
    },

    Score, // NOSONAR

    /**
     * Erzeugt ein Userobjekt bestehend aus Usernamen und einem Sessiontoken (Token wird automatisch generiert)
     *
     * @param pUsername Username des Users als String
     */
    User: function (pUsername) { // NOSONAR
        logging.Info("initializing new User");
        logging.Parameter("pUsername", pUsername);
        this.name = pUsername;
        this.token = operations.generateToken();
        this.visits = [];
        this.score = new Score();
        logging.Info("initializing User done");
    },

    /**
     * Erzeugt ein neues Location-Objekt bestehend aus Raumnummer und Identifier
     *
     * @param pRoomnumber Nummer des Raumes als String (undefined wenn Location sich draußen befindet)
     * @param pIdentifier Identifier anhand dessen ein Scan zu diesem Raum führt
     */
    Location: function (pRoomnumber, pIdentifier) { // NOSONAR
        logging.Info("initializing new Location");
        logging.Parameter("pRoomnumber", pRoomnumber);
        logging.Parameter("pIdentifier", pIdentifier);
        this.roomnumber = pRoomnumber;
        this.identifier = pIdentifier;
        logging.Info("initializing Location done");
    },

    /**
     * Ausstellungs-Objekt bestehend aus dem Namen der jeweiligen Ausstellung, einer Beschreibung,
     * einem Pfad (String) zum Thumbnail und ein Array an Pfaden (String) zu zugehörigen Bildern
     *
     * @param pName Name der Ausstellung als String
     * @param pDescription Beschreibung der Ausstellung als HTML formatierten String
     * @param pThumbnailPath Bildpfad zum Ausstellungsbild als String
     * @param pImagePaths Array der Strings zu den Bildern der Ausstellung
     * @constructor
     */
    Exposition: function (pName, pDescription, pThumbnailPath, pImagePaths) { // NOSONAR
        logging.Info("initializing new Exposition");
        logging.Parameter("pName", pName);
        logging.Parameter("pDescription", pDescription);
        logging.Parameter("pThumbnail", pThumbnailPath);
        logging.Parameter("pImagePaths", pImagePaths);
        this.name = pName;
        this.description = pDescription;
        this.thumbnailPath = pThumbnailPath;
        this.imagePaths = pImagePaths;
        logging.Info("initializing Exposition done");
    },

    /**
     * Minigames sollten flexibel sein, das heißt es müssen unterschiedliche Objekte
     * für unterschiedliche Minigames existieren.
     *
     * Dies is das SimpleQuiz, welches vom Typ Single_Choice ist und keine Bilder als Frage-/Antwortdaten enthält
     *******************************************************************************
     * Ein SimpleQuiz besteht aus einer Frage und einem Array an Antworten, sowie der Anzahl an Punkten, die der
     * User bei richtiger Beantwortung erhält.
     *
     * @param pQuestion die Frage als String
     * @param pAnswers die Antworten auf die Frage als Array, bestehend aus Answer-Objekten
     * @param pPoints Anzahl der Punkte die es bei richtiger Beantwortung der Frage gibt als Integer
     */
    SimpleQuiz: function (pQuestion, pAnswers, pPoints) { // NOSONAR
        logging.Info("initializing new SimpleQuiz");
        logging.Parameter("pQuestion", pQuestion);
        logging.Parameter("pAnswers", pAnswers);
        logging.Parameter("pPoints", pPoints);
        this.type = Game.SINGLE_CHOICE.type;
        this.question = pQuestion;
        this.answers = pAnswers;
        this.points = pPoints;
        logging.Info("initializing SimpleQuiz done");
    },

    /**
     * Antworten auf SimpleQuiz Fragen
     * @param pAnswer Antwort als String
     * @param pIsCorrect Boolean der definiert, ob diese Antwort eine korrekte Antwort auf die Frage ist
     * @constructor
     */
    Answer: function (pAnswer, pIsCorrect) { // NOSONAR
        logging.Info("initializing new Answer");
        logging.Parameter("pAnswer", pAnswer);
        logging.Parameter("pIsCorrect", pIsCorrect);
        this.isCorrect = pIsCorrect;
        this.answer = pAnswer;
        logging.Info("initializing Answer done");
    },

    /**
     * Visit-Objekt, das den Besuch und Erfolg eines Nutzers nach dem Spielen eines Spiels an einer Location darstellt
     * @param pLocationMapping LocationMapping-Object der Ausstellung, an der der Nutzer gespielt hat
     * @param pGames Array der Game-Objekte die bei diesem Objekt gespielt wurde
     * @param pIsSuccessful Boolean ob das Spiel erfolgreich abgeschlossen (Richtige Antwort) wurde 
     * @param pRoomState Status der Abfertigung, dargestellt durch ein Objekt aus dem "RoomStates"-Enum
     * @constructor
     */
    Visit: function (pLocationMapping, pGames, pIsSuccessful, pRoomState) { // NOSONAR
        logging.Info("initializing new Visit");
        logging.Parameter("pLocationMapping", pLocationMapping);
        logging.Parameter("pGame", pGames);
        logging.Parameter("pIsSuccessful", pIsSuccessful);
        this.location = pLocationMapping.location;
        this.games = pGames;
        this.success = pIsSuccessful;
        this.state = pRoomState ? pRoomState : RoomStates.VISITED;
        logging.Info("initializing Visit done");
    },

    /**
     * Mapping um Zugehörigkeit einer Ausstellung zu einer Location und den zugehörigen Games auszudrücken
     * @param pLocation Location-Objekt an der die Ausstellung stattfindet
     * @param pExposition Ausstellungs-Objekt, das an der Location stattfindet
     * @param pGames Array an Games-Objekten die an dieser Station zu spielen sind
     * @constructor
     */
    LocationMapping: function (pLocation, pExposition, pGames) { // NOSONAR
        logging.Info("initializing new LocationMapping");
        logging.Parameter("pLocation", pLocation);
        logging.Parameter("pExposition", pExposition);
        logging.Parameter("pGames", pGames);
        this.location = pLocation;
        this.exposition = pExposition;
        this.games = pGames;
        logging.Info("initializing LocationMapping done");
    },

    /**
     * Mapping um aktivierte Locations für bestimmte Events zu realisieren
     * @param pEvent Event an dem die Location freigeschaltet ist
     * @param pLocationMapping Location die am Event freigeschaltet ist
     * @constructor
     */
    EventMapping: function (pEvent, pLocationMapping) { // NOSONAR
        logging.Info("initializing new EventMapping");
        logging.Parameter("pEvent", pEvent);
        logging.Parameter("pLocationMapping", pLocationMapping);
        this.event = pEvent;
        this.locationMapping = pLocationMapping;
        logging.Info("initializing EventMapping done");
    }

/*
 * /** Beim starten der Anwendung muss es eine Art Template geben, für welches
 * hinterlegt ist, welche Räume mit welchen Fragen aktiv sind pName -> Name des
 * Events (Tag der offenen Tür, Girls Day...) pMinigameRoomMapping -> vom Typ
 * MinigameRoomMapping, hinterlegt welcher Raum welches Minigame hat /
 * EventTemplate: function (pName, pMinigameRoomMapping) {
 * logging.Info("initializing new EventTemplate"); logging.Parameter("pName",
 * pName); logging.Parameter("pMinigameRoomMapping", pMinigameRoomMapping);
 * this.name = pName; this.minigameRoomMappings = pMinigameRoomMapping;
 * logging.Info("initializing EventTemplate done"); }
 */

};