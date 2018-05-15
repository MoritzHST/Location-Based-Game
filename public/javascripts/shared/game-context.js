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
GameState = {
    CODE_SCANNED: "CODE_SCANNED",
    CODE_PENDING: "CODE_PENDING"
};