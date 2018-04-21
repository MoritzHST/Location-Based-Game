const logging = require('./logging');
const operations = require('./operations');

module.exports = {

    /**
     * Beim starten der Anwendung muss es eine Art Template geben, für welches
     * hinterlegt ist, welche Räume mit welchen Fragen aktiv sind
     *
     * pName -> Name des Events (Tag der offenen Tür, Girls Day...)
     * pMinigameRoomMapping -> vom Typ MinigameRoomMapping, hinterlegt welcher Raum
     *                         welches Minigame hat
     */
    EventTemplate: function (pName, pMinigameRoomMapping) {
        logging.Info("initializing new EventTemplate");
        logging.Parameter("pName", pName);
        logging.Parameter("pMinigameRoomMapping", pMinigameRoomMapping);
        this.name = pName;
        this.minigameRoomMappings = pMinigameRoomMapping;
        logging.Info("initializing EventTemplate done");
    },

    /**
     * Erzeugt ein Userobjekt bestehend aus Usernamen und einem Sessiontoken
     *
     * pUsername -> Username des Users als String
     */
    User: function (pUsername) {
        logging.Info("initializing new User");
        logging.Parameter("pUsername", pUsername);
        this.name = pUsername;
        this.token = operations.generateToken();
        logging.Info("initializing User done");
    },

    /**
     * Minigames sollten flexibel sein, das heißt es müssen unterschiedliche Objekte
     * für unterschiedliche Minigames existieren.
     *******************************************************************************
     * Ein Quiz besteht aus einer Frage und einer Antwort, es ist sinnvoll auf
     * Datenebene die Richtige von den falschen Antworten zu trennen
     *
     * pQuestion -> die Frage als String
     * pAnswers -> die Antworten auf die Frage
     */
    Quiz: function (pQuestion, pAnswers) {
        logging.Info("initializing new Quiz");
        this.question = pQuestion;
        this.answers = pAnswers;
    },

    /**
     * Antworten auf Quiz fragen
     * @param pAnswer Antwort als String
     * @param pIsCorrect Boolean der definiert, ob diese Antwort eine korrekte Antwort auf die Frage ist
     * @constructor
     */
    Answer: function (pAnswer, pIsCorrect) {
        this.answer = pAnswer;
        this.isCorrect = pIsCorrect;
    },

    /**
     * Für unterschiedliche Räume können unterschiedliche Minigames aktiv sein, es
     * muss also möglich sein, diese flexibel zu mappen
     *
     * pRoom -> vom Typ Room, hinterlegt ein Raumobjekt
     * pMinigame -> vom Typ eines Minigames (Quiz, ...), hinterlegt ein Minigameobjekt
     */
    MinigameRoomMapping: function (pRoom, pMinigame) {
        logging.Info("initializing new MinigameRoomMapping");
        logging.Parameter("pRoom", pRoom);
        logging.Parameter("pMinigame", pMinigame);
        this.room = pRoom;
        this.minigame = pMinigame;
        logging.Info("initializing MinigameRoomMapping done");
    },

    /**
     * Erzeugt ein neues Raumobjekt bestehend aus Raumnummer und optionalem Usernamen
     *
     * pRoomnumber -> Nummer des Raumes als String
     * pName -> Name des Raumes
     * pDescription -> Info zum Raum
     */
    Room: function (pRoomnumber, pName, pDescription, pImage) {
        logging.Info("initializing new Room");
        logging.Parameter("pRoomnumber", pRoomnumber);
        logging.Parameter("pName", pName);
        this.roomnumber = pRoomnumber;
        this.name = pName;
        this.description = pDescription;
        this.image = pImage;
        logging.Info("initializing Room done");
    }
};