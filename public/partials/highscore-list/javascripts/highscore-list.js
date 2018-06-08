var highScoreRefresh = setInterval(initHighscoreList, 5000);
var alternateColorFlag = false;

function initHighscoreList() {
    if (highScoreRefresh) {
        clearInterval(highScoreRefresh);
        highScoreRefresh = setTimeout(getHighscoreData, 5000);
    }
    getHighscoreData();
}

function getHighscoreData() {
    $.get("/get/scorelist")
        .done(function (obj) {
            alternateColorFlag = false;
            $(".highscore-list-entry-row").remove();
            for (let i in obj) {
                if (obj.hasOwnProperty(i)) {
                    newHighscoreListEntry(obj[i]);
                }
            }
        });
}

function newHighscoreListEntry(obj) {
    let alternateColor = " ";

    if (user && user.name === obj.name) {
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
    });

    let cellName = $("<div/>", {
        text: obj.name,
        class: "highscore-list-entry-row" + alternateColor
    });

    let cellScore = $("<div/>", {
        text: obj.score.score,
        class: "highscore-list-entry-row" + alternateColor
    });

    let cellLocation = $("<div/>", {
        text: obj.score.locations,
        class: "highscore-list-entry-row" + alternateColor
    });

    let cellGames = $("<div/>", {
        text: obj.score.games,
        class: "highscore-list-entry-row" + alternateColor
    });

    $(".highscore-grid").append([cellPlace, cellName, cellScore, cellLocation, cellGames]);
}