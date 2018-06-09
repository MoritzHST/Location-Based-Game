/**
 * Enum, das die möglichen Minispiel-Typen abbildet.
 */
// NOSONAR
Game = {
    SINGLE_CHOICE: {
        type: "single_choice",
        partial: "partials/simple-text-quiz/simple-text-quiz.html",
        initFunction: "initSimpleTextQuiz"
    },
    MULTIPLE_CHOICE: {type: "multiple_choice"}
};

/**
 * Enum, welches den aktuellen Spielstatus abbildet
 * CODE_SCANNED -> Code wurde gescannt, Ausstellungs-Übersicht dementsprechend anpassen
 * CODE_PENDING -> Code wurde noch nicht gescannt, Ausstellungs-Übersicht dementsprechend anpassen
 */
// NOSONAR
GameViewContext = {
    CODE_SCANNED: "CODE_SCANNED",
    CODE_PENDING: "CODE_PENDING",
    SCAN_ATTEMPT_FROM_PLAY_OVERVIEW: "SCAN_ATTEMPT_FROM_PLAY_OVERVIEW",
    SCAN_ATTEMPT_FROM_EXPOSITION_INFO: "SCAN_ATTEMT_FROM_EXPOSITION_INFO"
};
/**
 * Enum welches die einzelnen Quizstatus abbildet
 * @type {{UNPLAYED: number, CORRECT: number, WRONG: number}}
 */
// NOSONAR
GameStates = {
    UNPLAYED: 0,
    CORRECT: 1,
    WRONG: 2
};
/**
 * Enum welches die einzelnen Locationstatus abbildet
 * @type {{VISITED: number, COMPLETED: number, FLAWLESS: number}}
 */
// NOSONAR
RoomStates = {
    VISITED: 0,
    COMPLETED: 1,
    FLAWLESS: 2
};