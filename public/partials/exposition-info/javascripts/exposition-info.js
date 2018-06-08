var gameObj;
var errorTimer;
var locationObj;

function initExpositionInfo(obj) {
    //Variablen Clearen
    gameObj = undefined;
    locationObj = undefined;
    errorTimer = undefined;
    // LocationIdentifier setzen
    locationObj = obj.location;
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
        $("#exposition-info-info-header").html(obj.exposition.name + ": Info");
        $("#exposition-info-mission-header").html(obj.exposition.name + ": Missionen");
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
}

// Initialisierngsfunktion wenn noch kein Code gescanned wurde
function initContextCodePending(obj) {
    // Wenn der Raum noch nicht fertig ist muss der Scan button
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
    // Abfragen, ob Antworten angezeigt werden können
    $.get('get/answers', {identifier: btoa(locationObj.identifier)})
        .done(function (callbackObj) {
            if (callbackObj) {
                initGameFinishedView(callbackObj);
            }
        })
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
    $(".current-game-display-frame").removeClass("active active-history");
    $("#game-display-" + game.gameNumber).addClass("active");
    // Spiel anzeigen
    renderGameByType(game);
}

function renderGameByType(obj) {
    obj.locationId = locationObj._id;
    for (let i in Game) {
        if (Game[i].type === obj.type) {
            setNodeHookFromFile($("#mission-hook"), Game[i].partial, undefined, undefined, Game[i].initFunction, obj);
        }
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

    // Antworten sind da, also einmal die von Node ausgewerteten ANntworten
    // abfragen
    $.get('get/answers', {identifier: locationObj.identifier})
        .done(function (callbackObj) {
            if (callbackObj) {
                initGameFinishedView(callbackObj);
            }
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

//Antworten sollen einheitlich versendet werden und ausgewertet werden, weshalb der PartialParent die Funktion implementiert
function submitAnswer(answerObj) {
    $.post("post/answer", answerObj)
        .done(function () {
            $("#game-display-" + gameObj.currentGameNumber)
                .addClass("active-history game-completed game-completed-" + GameStates.CORRECT)
                .removeClass("active");
            setNodeHookFromFile($("#mission-hook"), "partials/play-success-box/play-success-box.html", function () {
                $("#success-box-title").text("Die Antwort war richtig!");

                let continueButton = $("<a/>", {
                    class: "btn btn-sm btn-primary btn-block host-button host-function-button",
                    text: "Weiter"
                }).appendTo($("#mission-hook"));

                continueButton.on("click", nextGame);
            }, undefined);
        })
        .fail(function (obj) {
            //Nur das nächste Spiel starten, wenn die Antwort falsch war, um interne Fehler nicht zu bestrafen
            if (obj.status === 400) {
                $("#game-display-" + gameObj.currentGameNumber).addClass("game-completed-" + GameStates.WRONG);
                setNodeHookFromFile($("#mission-hook"), "partials/failure-box/failure-box.html", function () {
                    $("#failure-box-title").text("Die Antwort war falsch!");
                    let continueButton = $("<a/>", {
                        class: "btn btn-sm btn-primary btn-block host-button host-function-button",
                        text: "Weiter"
                    }).appendTo($("#mission-hook"));

                    continueButton.on("click", nextGame);
                }, undefined);
            }
            else {
                setNodeHookFromFile($("#mission-hook"), "failure-box/failure-box.html", function () {
                    $("#failure-box-title").text("Es ist ein Fehler aufgetreten!");
                }, undefined);
            }
        });
}

// GameObject Konstruktor
function GameObject() {
    this.games = [];
}