var answerObj;

function initExpositionInfo(obj) {
    // Tabs setzen
    $(function () {
        $("#exposition-info-switch").tabs();
    });

    setCurrentGameDisplay(obj);

    setGames(obj);

    //Abschicken Button registrieren
    $("#exposition-submit-game-answer").on("click", function () {
        console.log(answerObj);
    })
}

function setCurrentGameDisplay(obj) {
    for (let i in obj.games) {
        if (obj.games.hasOwnProperty(i)) {
            let gameDisplayContainerClass = "current-game-display-frame";
            if (/**TODO: Flag wenn Spiel bereits abgeschlossen wurde verifen**/ false) {
                gameDisplayContainerClass += " game-completed";
            }
            //Neue Container für die Anzeige generieren
            $("<a/>", {
                id: "game-display-" + i,
                class: gameDisplayContainerClass
            }).appendTo($("#current-game-display-wrapper"));
        }
    }
}

function setGames(obj) {
    let game;
    for (let i in obj.games) {
        if (obj.games.hasOwnProperty(i)) {
            if (obj.games[i]/**TODO: Flag wenn Spiel bereits abgeschlossen wurde verifen**/) {
                $("#game-display-" + i).addClass("active");
                game = obj.games[i];
            }
            break;
        }
    }

    renderGameByType(game);
}

function renderGameByType(obj) {
    switch (obj.type) {
        case Game.SINGLE_CHOICE:
            console.log(obj);
            setNodeHookFromFile($("#mission-hook"), "partials/simple-text-quiz/simple-text-quiz.html", undefined, undefined, "initSimpleTextQuiz", obj);
            break;
    }
}