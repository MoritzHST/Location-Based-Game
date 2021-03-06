/**
 * Enum, das die möglichen Minispiel-Typen abbildet.
 */
Game = { // NOSONAR
    SINGLE_CHOICE: {
        type: "single_choice",
        partial: "partials/simple-text-quiz/simple-text-quiz.html",
        initFunction: "initSimpleTextQuiz",
        name: "Single Choice"
    },
    MULTIPLE_CHOICE: {type: "multiple_choice"},
    getNameByType: function (pType) {
        for (let i in this) {
            if (this.hasOwnProperty(i) && this[i].type === pType) {
                return this[i].name;
            }
        }
    }
};

/**
 * Enum, welches den aktuellen Spielstatus abbildet
 * CODE_SCANNED -> Code wurde gescannt, Ausstellungs-Übersicht dementsprechend anpassen
 * CODE_PENDING -> Code wurde noch nicht gescannt, Ausstellungs-Übersicht dementsprechend anpassen
 */
GameViewContext = {// NOSONAR
    CODE_SCANNED: "CODE_SCANNED",
    CODE_PENDING: "CODE_PENDING",
    SCAN_ATTEMPT_FROM_PLAY_OVERVIEW: "SCAN_ATTEMPT_FROM_PLAY_OVERVIEW",
    SCAN_ATTEMPT_FROM_EXPOSITION_INFO: "SCAN_ATTEMT_FROM_EXPOSITION_INFO"
};
/**
 * Enum welches die einzelnen Quizstatus abbildet
 * @type {{UNPLAYED: number, CORRECT: number, WRONG: number}}
 */
GameStates = {// NOSONAR
    UNPLAYED: 0,
    CORRECT: 1,
    WRONG: 2
};
/**
 * Enum welches die einzelnen Locationstatus abbildet
 * @type {{VISITED: number, COMPLETED: number, FLAWLESS: number}}
 */
RoomStates = {// NOSONAR
    VISITED: 0,
    COMPLETED: 1,
    FLAWLESS: 2
};