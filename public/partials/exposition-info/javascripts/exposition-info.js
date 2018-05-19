var answerObj;
var gameObj;
var errorTimer;

function initExpositionInfo(obj) {
    // Tabs setzen
    $(function () {
        $("#exposition-info-switch").tabs();
    });

    //Infos aus dem Objekt anzeigen
    initViewContent(obj);

    if (obj.context === GameViewContext.CODE_SCANNED /**TODO Visiitstate verodern*/) {
        initContextCodeScanned(obj);
    }
    else {
        initContextCodePending(obj);
    }

}

//Initialisiert HTML-Elemente
function initViewContent(obj) {
    //Namen setzen
    if (obj.exposition.name) {
        $("#exposition-name").html(obj.exposition.name);
    }
    else {
        $("#exposition-name").hide();
    }
    //Bilder setzen
    if (obj.exposition.imagePaths) {
        //TODO: Images einbinden in Slider
    }
    else {
        $("#exposition-images").hide();
    }
    //Beschreibung setzen
    if (obj.exposition.description) {
        $("#exposition-description").html(obj.exposition.description);
    }
    else {
        $("#exposition-description").hide();
    }
}
//Initialisierungsfunktion falls ein Code gescanned wurde
function initContextCodeScanned(obj) {
    //Code gescanned -> Button kann also ausgeblendet werden
    $("#exposition-scan-qr").hide();

    setCurrentGameDisplay(obj);

    //Das erste nicht gespielte Spiel heraussuchen
    for (let i in gameObj.games) {
        if (gameObj.games.hasOwnProperty(i)) {
            if (gameObj.games[i] /**TODO: Verifen ob Spiel abgeschlosssen wurde **/) {
                setCurrentGame(gameObj.games[i]);
                gameObj.currentGameNumber = i;
                break;
            }
        }
    }

    //Abschicken Button registrieren
    $("#exposition-submit-game-answer").on("click", function () {
        if (answerObj) {
            //Location id setzen,  um Auswertung zu vereinfachen
            answerObj.locationId = obj.location._id;
            $.post("post/answer", answerObj)
                .done(function () {
                    setNodeHookFromFile($("#success-hook"), "partials/play-success-box/play-success-box.html", function () {
                        $("#success-box-title").html("Die Antwort war richtig!");
                        //Nach Konstanter Sekunden-Anzahl wieder ausblenden
                        clearInterval(errorTimer);
                        errorTimer = setTimeout(function () {
                            clearNodeHook("success-hook");
                        }, notificationFadeOut);
                    });
                    nextGame();
                })
                .fail(function (obj) {
                    setNodeHookFromFile($("#failure-hook"), "partials/failure-box/failure-box.html", function (errMsgObj) {
                        $("#failure-box-error-message").html(errMsgObj.responseJSON.error);
                        //Nach Konstanter Sekunden-Anzahl wieder ausblenden
                        clearInterval(errorTimer);
                        errorTimer = setTimeout(function () {
                            clearNodeHook("failure-hook");
                        }, notificationFadeOut);
                    }, obj);

                    if (obj.status === 400) {
                        nextGame();
                    }
                });
        }
    });
}

//Initialisierngsfunktion wenn noch kein Code gescanned wurde
function initContextCodePending(obj) {
    //Button Abschicken ausblenden, da noch kein Quiz aktiv ist
    $("#exposition-submit-game-answer").hide();

    //Button zum scannen muss mit einer Route verknüpft werden
    $("#exposition-scan-qr").on("click", function () {
        setNodeHookFromFile($("#content-hook"), "../partials/qr-scanner/qr-scanner.html", function () {
            $("#content-hook").ready(function () {
                obj.context = GameViewContext.SCAN_ATTEMPT_FROM_EXPOSITION_INFO;
                initScanner(obj);
            });
        });
    });
}

//Verarbeitet die Daten, um die Kreise für die Übersicht über das akutelle Spiel zu initialisieren
//Dazu werden neue Container angelegt mit den repräsentativen ID's und Klassen
function setCurrentGameDisplay(obj) {
    //Spielobjekt initialiseren
    gameObj = new GameObject();
    gameObj.games = obj.games;

    for (let i in gameObj.games) {
        if (gameObj.games.hasOwnProperty(i)) {
            let gameDisplayContainerClass = "current-game-display-frame";
            if (/**TODO: Flag wenn Spiel bereits abgeschlossen wurde verifen**/ false) {
                gameDisplayContainerClass += " game-completed";
            }
            //Neue Container für die Anzeige generieren
            $("<a/>", {
                id: "game-display-" + i,
                class: gameDisplayContainerClass
            }).appendTo($("#current-game-display-wrapper"));

            //Clientseite GameNummer zuweisen, um Spiele refernzieren zu können
            gameObj.games[i].gameNumber = i;
        }
    }
}

//Das aktuelle Spiel makieren und anzeigen
function setCurrentGame(game) {
    //Das Aktuelle Active Flag entfernen
    $(".current-game-display-frame").removeClass("active");

    if (true/**TODO: Flag wenn Spiel bereits abgeschlossen wurde verifen**/) {
        $("#game-display-" + game.gameNumber).addClass("active");
    }
    //Spiel anzeigen
    renderGameByType(game);
}

function renderGameByType(obj) {
    switch (obj.type) {
        case Game.SINGLE_CHOICE:
            setNodeHookFromFile($("#mission-hook"), "partials/simple-text-quiz/simple-text-quiz.html", undefined, undefined, "initSimpleTextQuiz", obj);
            break;
    }
}

function nextGame() {
    //Altes Spiel als fertig makieren
    $("#game-display-" + gameObj.currentGameNumber).addClass("game-completed");

    //Durchloopen um das nächste zu finden und zu setzen
    for (let i in gameObj.games) {
        if (gameObj.games.hasOwnProperty(i)) {
            if (parseInt(gameObj.games[i].gameNumber) === parseInt(gameObj.currentGameNumber) + 1) {
                setCurrentGame(gameObj.games[i]);
                gameObj.currentGameNumber++;
                break;
            }
        }
    }

    //Es wurde keins gefunden

    $("#mission-hook").html("Alle durch");
}

//GameObject Konstruktor
function GameObject() {
    this.games = [];
}