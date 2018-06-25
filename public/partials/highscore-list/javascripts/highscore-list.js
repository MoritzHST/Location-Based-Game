var highScoreRefresh;
var alternateColorFlag = false;

function initHighscoreList() {
    clearInterval(highScoreRefresh);
    highScoreRefresh = setInterval(getHighscoreData, refreshHighscoreList);

    //dummyitem hinzufügen
    $(".highscore-grid").append($("<div/>", {
        class: "highscore-list-entry-row",
    }).hide());
    getHighscoreData();
}

function getHighscoreData() {
    //Ruft die HighScore-Liste ab
    $.get("/get/scorelist")
        .done(function (obj) {
            //Ggf. maximale Anzahl in config.js deklariert -> überflüssige entfernen
            obj = obj.slice(0, highscoreEntries);
            alternateColorFlag = false;
            //Alte Liste ausblenden und entfernen, neue Elemente setzen
            $(".highscore-list-entry-row").fadeOut("slow", function () {
                $(".highscore-list-entry-row").remove();
                for (let i in obj) {
                    if (obj.hasOwnProperty(i)) {
                        newHighscoreListEntry(obj[i]);
                    }
                }
            });
        });
}

/**
 * Setzt die einzelnen Tabellenreihen
 * Wenn die Seite von einem Benutzer aufgerufen wird, wird dieser selbst in der Liste fett und kursiv makiert
 * Die Farben der Tabelle sind alternierend (alternateColorFlag)
 */
function newHighscoreListEntry(obj) {
    let alternateColor = " ";

    if (typeof user !== 'undefined' && user.name === obj.name) {
        alternateColor += " highscore-list-highlight-user "
    }

    if (alternateColorFlag) {
        alternateColor += "highscore-list-alternate-color"
        alternateColorFlag = false;
    }
    else {
        alternateColorFlag = true;
    }

    let cellPlace = $("<div/>", {
        text: obj.place,
        class: "highscore-list-entry-row" + alternateColor
    }).hide().fadeIn("slow");

    let cellName = $("<div/>", {
        text: obj.name,
        class: "highscore-list-entry-row" + alternateColor
    }).hide().fadeIn("slow");

    let cellScore = $("<div/>", {
        text: obj.score.score,
        class: "highscore-list-entry-row" + alternateColor
    }).hide().fadeIn("slow");

    let cellLocation = $("<div/>", {
        text: obj.score.locations,
        class: "highscore-list-entry-row" + alternateColor
    }).hide().fadeIn("slow");

    let cellGames = $("<div/>", {
        text: obj.score.games,
        class: "highscore-list-entry-row" + alternateColor
    }).hide().fadeIn("slow");

    $(".highscore-grid").append([cellPlace, cellName, cellScore, cellLocation, cellGames]);
}