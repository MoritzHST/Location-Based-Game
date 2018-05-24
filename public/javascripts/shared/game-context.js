/**
 * Enum, das die möglichen Minispiel-Typen abbildet.
 */
Game = {
    SINGLE_CHOICE: "single_choice",
    MULTIPLE_CHOICE: "multiple_choice"
};

/**
 * Enum, welches den aktuellen Spielstatus abbildet
 * CODE_SCANNED -> Code wurde gescannt, Ausstellungs-Übersicht dementsprechend anpassen
 * CODE_PENDING -> Code wurde noch nicht gescannt, Ausstellungs-Übersicht dementsprechend anpassen
 */
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
GameStates = {
    UNPLAYED: 0,
    CORRECT: 1,
    WRONG: 2
};
/**
 * Enum welches die einzelnen Locationstatus abbildet
 * @type {{VISITED: number, COMPLETED: number, FLAWLESS: number}}
 */
RoomStates = {
    VISITED: 0,
    COMPLETED: 1,
    FLAWLESS: 2
};