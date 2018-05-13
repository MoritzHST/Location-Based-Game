const logging = require('./logging');
const operations = require('./operations');
require('../public/javascripts/shared/game-types.js');

RoomStates = {
    VISITED: 0,
    STARTED: 1,
    COMPLETED: 2,
    FLAWLESS: 3
};

module.exports = {

    Type: Game,

    RoomStates: RoomStates,

    /**
     * Event-Objekt bestehend aus Eventnamen und Gültigkeitsdatum. Ein Event gilt immer nur für einen Tag
     * @param pEventName Name des Events
     * @param pDate Datum an dem dieses Event stattfindet
     * @constructor
     */
    Event: function (pEventName, pDate) {
        logging.Info("initializing new Event");
        logging.Parameter("pEventName", pEventName);
        logging.Parameter("pDate", pDate);
        this.name = pEventName;
        this.date = pDate;
        logging.Info("initializing Event done");
    },

    /**
     * Erzeugt ein Userobjekt bestehend aus Usernamen und einem Sessiontoken
     *
     * @param pUsername Username des Users als String
     */
    User: function (pUsername) {
        logging.Info("initializing new User");
        logging.Parameter("pUsername", pUsername);
        this.name = pUsername;
        this.token = operations.generateToken();
        logging.Info("initializing User done");
    },

    /**
     * Erzeugt ein neues Location-Objekt bestehend aus Raumnummer, Identifier und ggf einem Bild
     *
     * @param pRoomnumber Nummer des Raumes als String(undefined wenn Location sich draußen befindet)
     * @param pIdentifier Identifier anhand dessen ein Scan zu diesem Raum führt
     */
    Location: function (pRoomnumber, pIdentifier) {
        logging.Info("initializing new Location");
        logging.Parameter("pRoomnumber", pRoomnumber);
        logging.Parameter("pIdentifier", pIdentifier);
        this.roomnumber = pRoomnumber;
        this.identifier = pIdentifier;
        logging.Info("initializing Location done");
    },

    /**
     * Ausstellungs-Objekt bestehend aus dem namen der jeweiligen Ausstellung und dem Pfad zum zugehörigen Bild
     *
     * @param pName Name der Ausstellung
     * @param pDescription Beschreibung der Ausstellung
     * @param pImagePath Bildpfad zum Ausstellungsbild
     * @constructor
     */
    Exposition: function (pName, pDescription, pImagePath) {
        logging.Info("initializing new Exposition");
        logging.Parameter("pName", pName);
        logging.Parameter("pDescription", pDescription);
        logging.Parameter("pImagePath", pImagePath);
        this.name = pName;
        this.description = pDescription;
        this.image = pImagePath;
        logging.Info("initializing Exposition done")
    },

    /**
     * Minigames sollten flexibel sein, das heißt es müssen unterschiedliche Objekte
     * für unterschiedliche Minigames existieren.
     *******************************************************************************
     * Ein SimpleQuiz besteht aus einer Frage und einer Antwort, es ist sinnvoll auf
     * Datenebene die Richtige von den falschen Antworten zu trennen
     *
     * @param pQuestion die Frage als String
     * @param pAnswers die Antworten auf die Frage
     * @param pPoints Anzahl der Punkte die es bei richtiger Beantwortung der Frage gibt
     */
    SimpleQuiz: function (pQuestion, pAnswers, pPoints) {
        logging.Info("initializing new SimpleQuiz");
        logging.Parameter("pQuestion", pQuestion);
        logging.Parameter("pAnswers", pAnswers);
        logging.Parameter("pPoints", pPoints);
        this.type = Game.SINGLE_CHOICE;
        this.question = pQuestion;
        this.answers = pAnswers;
        this.points = pPoints;
        logging.Info("initializing SimpleQuiz done");
    },

    /**
     * Antworten auf SimpleQuiz fragen
     * @param pAnswer Antwort als String
     * @param pIsCorrect Boolean der definiert, ob diese Antwort eine korrekte Antwort auf die Frage ist
     * @param pImagePath Pfad zur zugefügten BildDatei für die Antwort
     * @constructor
     */
    Answer: function (pAnswer, pIsCorrect, pImagePath) {
        logging.Info("initializing new Answer");
        logging.Parameter("pAnswer", pAnswer);
        logging.Parameter("pIsCorrect", pIsCorrect);
        logging.Parameter("pImagePath", pImagePath);
        this.isCorrect = pIsCorrect;
        this.answer = pAnswer;
        this.imagePath = pImagePath;
        logging.Info("initializing Answer done");
    },

    /**
     * Visit-Objekt, das den Besuch und Erfolg eines Nutzers nach dem Spielen eines Spiels an einer Location darstellt
     * @param pLocationMapping LocationMapping-Object der Ausstellung, an der der Nutzer gespielt hat
     * @param pGames Spiele die bei diesem Objekt gespielt wurde
     * @param pIsSuccessful Boolean ob das Spiel erfolgreich abgeschlossen(Richtige Antwort) wurde
     * @param pRoomState Status der Abfertigung
     * @constructor
     */
    Visit: function (pLocationMapping, pGames, pIsSuccessful, pRoomState) {
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
     * Mapping um Zugehörigkeit einer Ausstellung zu einer Location auszudrücken
     * @param pLocation Location an der die Ausstellung stattfindet
     * @param pExposition Ausstellung die an der Location stattfindet
     * @param pGames Liste an Minigames die an dieser Station zu spielen sind
     * @constructor
     */
    LocationMapping: function (pLocation, pExposition, pGames) {
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
    EventMapping: function (pEvent, pLocationMapping) {
        logging.Info("initializing new EventMapping");
        logging.Parameter("pEvent", pEvent);
        logging.Parameter("pLocationMapping", pLocationMapping);
        this.event = pEvent;
        this.locationMapping = pLocationMapping;
        logging.Info("initializing EventMapping done");
    }

    /*
    /**
     * Beim starten der Anwendung muss es eine Art Template geben, für welches
     * hinterlegt ist, welche Räume mit welchen Fragen aktiv sind
     *
     * pName -> Name des Events (Tag der offenen Tür, Girls Day...)
     * pMinigameRoomMapping -> vom Typ MinigameRoomMapping, hinterlegt welcher Raum
     *                         welches Minigame hat
     * /
    EventTemplate: function (pName, pMinigameRoomMapping) {
        logging.Info("initializing new EventTemplate");
        logging.Parameter("pName", pName);
        logging.Parameter("pMinigameRoomMapping", pMinigameRoomMapping);
        this.name = pName;
        this.minigameRoomMappings = pMinigameRoomMapping;
        logging.Info("initializing EventTemplate done");
    }
    */

};