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
    $.get("/get/scorelist")
        .done(function (obj) {
            obj = obj.slice(0, highscoreEntries);
            alternateColorFlag = false;
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