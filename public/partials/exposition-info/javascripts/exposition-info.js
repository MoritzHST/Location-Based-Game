var answerObj;
var gameObj;
var errorTimer;
var locationIdentifier;

function initExpositionInfo(obj) {
    // LocationIdentifier setzen
    locationIdentifier = obj.location.identifier;
    // Tabs setzen
    $(function () {
        $("#exposition-info-switch").tabs();
    });

    // Infos aus dem Objekt anzeigen
    initViewContent(obj);

    if (obj.context === GameViewContext.CODE_SCANNED) {
        initContextCodeScanned(obj);
    }
    else {
        initContextCodePending(obj);
    }

}

// Initialisiert HTML-Elemente
function initViewContent(obj) {
    // Namen setzen
    if (obj.exposition.name) {
        $("#exposition-name").html(obj.exposition.name);
    }
    else {
        $("#exposition-name").hide();
    }
    // Bilder setzen
    if (obj.exposition.imagePaths && obj.exposition.imagePaths.length > 0) {
        let imagePaths = obj.exposition.imagePaths;
        for (let index = 0; index < imagePaths.length; index++) {
            let activeClass = index > 0 ? '' : 'active';

            $('<li data-target="#carousel-example-generic" data-slide-to="' + index + '" class="' + activeClass + '"></li>').appendTo($("ol.carousel-indicators"));

            let image = $('<img src="' + imagePaths[index] + '" alt="img-' + index + '">');
            let panel = $('<div class="item panel ' + activeClass + '"></div>');

            image.appendTo(panel);
            panel.appendTo($("#exposition-slider-image-wrapper"));
        }

        $("#exposition-images").carousel();
    }
    else {
        $("#exposition-images").hide();
    }
    // Beschreibung setzen
    if (obj.exposition.description) {
        $("#exposition-description").html(obj.exposition.description);
    }
    else {
        $("#exposition-description").hide();
    }
}

// Initialisierungsfunktion falls ein Code gescanned wurde
function initContextCodeScanned(obj) {
    // Code gescanned -> Button kann also ausgeblendet werden
    $("#exposition-scan-qr").hide();

    setCurrentGameDisplay(obj);

    // Das erste nicht gespielte Spiel heraussuchen
    for (let i in gameObj.games) {
        if (gameObj.games.hasOwnProperty(i) && gameObj.games[i].state === GameStates.UNPLAYED) {
            setCurrentGame(gameObj.games[i]);
            gameObj.currentGameNumber = i;
            break;
        }
    }

    // Abschicken Button registrieren
    $("#exposition-submit-game-answer").on("click", function () {
        if (answerObj) {
            // Location id setzen, um Auswertung zu vereinfachen
            answerObj.locationId = obj.location._id;
            $.post("post/answer", answerObj)
                .done(function () {
                    setNodeHookFromFile($("#success-hook"), "partials/play-success-box/play-success-box.html", function () {
                        $("#success-box-title").html("Die Antwort war richtig!");
                        // Nach Konstanter Sekunden-Anzahl wieder ausblenden
                        clearInterval(errorTimer);
                        errorTimer = setTimeout(function () {
                            clearNodeHook("success-hook");
                        }, notificationFadeOut);
                    });
                    $("#game-display-" + gameObj.currentGameNumber).addClass("game-completed game-completed-" + GameStates.CORRECT);
                    nextGame();
                })
                .fail(function (obj) {
                    setNodeHookFromFile($("#failure-hook"), "partials/failure-box/failure-box.html", function (errMsgObj) {
                        $("#failure-box-error-message").html(errMsgObj.responseJSON.error);
                        // Nach Konstanter Sekunden-Anzahl wieder ausblenden
                        clearInterval(errorTimer);
                        errorTimer = setTimeout(function () {
                            clearNodeHook("failure-hook");
                        }, notificationFadeOut);
                    }, obj);
                    $("#game-display-" + gameObj.currentGameNumber).addClass("game-completed-" + GameStates.WRONG);
                    if (obj.status === 400) {
                        nextGame();
                    }
                });
        }
    });
}

// Initialisierngsfunktion wenn noch kein Code gescanned wurde
function initContextCodePending(obj) {
    // Button Abschicken ausblenden, da noch kein Quiz aktiv ist
    $("#exposition-submit-game-answer").hide();

    // Abfragen, ob Antworten angezeigt werden können
    $.get('get/answers', {identifier: obj.location.identifier})
        .done(function (callbackObj) {
            initGameFinishedView(callbackObj);
        })
        .fail(function () {
            // Der Raum ist noch nicht fertig also muss der Scan button
            // reagieren
            // Button zum scannen muss mit einer Route verknüpft werden
            $("#exposition-scan-qr").on("click", function () {
                setNodeHookFromFile($("#content-hook"), "../partials/qr-scanner/qr-scanner.html", function () {
                    $("#content-hook").ready(function () {
                        obj.context = GameViewContext.SCAN_ATTEMPT_FROM_EXPOSITION_INFO;
                        initScanner(obj);
                    });
                });
            });
        });
}

// Verarbeitet die Daten, um die Kreise für die Übersicht über das akutelle
// Spiel zu initialisieren
// Dazu werden neue Container angelegt mit den repräsentativen ID's und Klassen
function setCurrentGameDisplay(obj) {
    // Spielobjekt initialiseren
    gameObj = new GameObject();
    gameObj.games = obj.games;
    // Wrapper clearen
    $("#current-game-display-wrapper").html("");

    for (let i in gameObj.games) {
        if (gameObj.games.hasOwnProperty(i)) {
            let gameDisplayContainerClass = "current-game-display-frame";
            if (gameObj.games[i].state !== GameStates.UNPLAYED) {
                gameDisplayContainerClass += " game-completed-" + gameObj.games[i].state + " game-completed";
            }
            // Neue Container für die Anzeige generieren
            $("<a/>", {
                id: "game-display-" + i,
                class: gameDisplayContainerClass,
                value: i,
                href: "#"
            }).appendTo($("#current-game-display-wrapper"));

            // Clientseite GameNummer zuweisen, um Spiele refernzieren zu können
            gameObj.games[i].gameNumber = i;
        }
    }
}

// Das aktuelle Spiel makieren und anzeigen
function setCurrentGame(game) {
    // Das Aktuelle Active Flag entfernen
    $(".current-game-display-frame").removeClass("active");
    $("#game-display-" + game.gameNumber).addClass("active");
    // Spiel anzeigen
    renderGameByType(game);
}

function renderGameByType(obj) {
    switch (obj.type) {
        case Game.SINGLE_CHOICE:
            setNodeHookFromFile($("#mission-hook"), "partials/simple-text-quiz/simple-text-quiz.html", undefined, undefined, "initSimpleTextQuiz", obj);
            break;
        case Game.MULTIPLE_CHOICE:
            // TODO
            break;
        default:
        // Nix zu tun
    }
}

function nextGame() {
    // Durchloopen um das nächste zu finden und zu setzen
    for (let i in gameObj.games) {
        if (gameObj.games.hasOwnProperty(i) && parseInt(gameObj.games[i].gameNumber) === parseInt(gameObj.currentGameNumber) + 1) {
            setCurrentGame(gameObj.games[i]);
            gameObj.currentGameNumber++;
            return;
        }
    }

    // Es wurde keins gefunden
    renderFinishedView();
}

function renderFinishedView() {
    // Das Aktuelle Active Flag entfernen
    $(".current-game-display-frame").removeClass("active");
    // Button deaktivieren
    $("#exposition-submit-game-answer").addClass("disabled");

    // Antworten sind da, also einmal die von Node ausgewerteten ANntworten
    // abfragen
    $.get('get/answers', {identifier: locationIdentifier})
        .done(function (callbackObj) {
            initGameFinishedView(callbackObj);
        });
}

function initGameFinishedView(obj) {
    // Neues GameObject zusammenbauen, das rein zur Anzeige dient
    gameObj = new GameObject();
    for (let i in obj) {
        if (obj.hasOwnProperty(i)) {
            let tmpObj = {};

            tmpObj.state = obj[i].state;
            tmpObj.question = obj[i].question;
            tmpObj.givenAnswer = obj[i].answer;
            tmpObj.type = obj[i].type;

            gameObj.games.push(tmpObj);
        }
    }
    setCurrentGameDisplay(gameObj);
    // der Button zum Scannen eines QR-Codes wird nicht benötigt, da der Raum
    // abgeschlossen ist
    $("#exposition-scan-qr").hide();

    // Spiel beendet -> Infotext
    setNodeHookFromFile($("#mission-hook"), 'partials/game-finished-view/game-finished-view.html');

    $(".current-game-display-frame").on("click", function () {
        if ($(this).hasClass("game-completed")) {
            $(".current-game-display-frame").removeClass("active-history");
            renderGameByType(gameObj.games[$(this).attr('value')]);
            $(this).addClass("active-history");
        }
    });
}

// GameObject Konstruktor
function GameObject() {
    this.games = [];
}