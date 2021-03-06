window.onload = init;
let user;
let loginHintTimer;
let logoutHintTimer;

$(function () {
    $('nav#menu').mmenu();
});

function init() {
    user = {};

    // initialize SlideInMenu
    setSlideInMenu();

    setHooks();
    // Nav-Menü "Spielübersicht"
    $("#game-play-overview").on("click", function () {
        setNodeHookFromFile($("#content-hook"), "../partials/game-overview-content/game-overview-content.html", undefined, undefined, "initGameOverviewContent");
    });
    // Nav-Menü "Score-Board"
    $("#game-play-highscore-list").on("click", function () {
        setNodeHookFromFile($("#content-hook"), "../partials/highscore-list/highscore-list.html", undefined, undefined, "initHighscoreList");
    });
    // Nav-Menü "Logout"
    $("#game-logout").on("click", function () {
        setNodeHookFromFile($("#failure-hook"), "../partials/play-logout-box/play-logout-box.html");
        setNodeHookFromFile($("#warning-hook"), "../partials/play-warning-box/play-warning-box.html", setLogoutHint);
    });
    // Nav-Menü "Raumplan"
    $("#game-room-map").on("click", function () {
        setNodeHookFromFile($("#content-hook"), "../partials/room-map/room-map.html", undefined, undefined, "initRoomMap");
    });
    // Nav-Menü "Spielanleitung"
    $("#game-manual").on("click", function () {
        setNodeHookFromFile($("#content-hook"), "../partials/manual/manual.html");
    });
    // Nav-Menü "Datenschutz"
    $("#game-privacy").on("click", function () {
        setNodeHookFromFile($("#content-hook"), "../partials/privacy/privacy.html");
    });
    // Nav-Menü "Impressum"
    $("#game-impressum").on("click", function () {
        setNodeHookFromFile($("#content-hook"), "../partials/impressum/impressum.html");
    });
    // Nav-Menü "Haftungsausschluss"
    $("#game-warranty").on("click", function () {
        setNodeHookFromFile($("#content-hook"), "../partials/warranty/warranty.html");
    });
    // Nav-Menü "Drittanbieter-Sofware"
    $("#game-thirdparty").on("click", function () {
        setNodeHookFromFile($("#content-hook"), "../partials/third-party/third-party.html");
    });
}

/**
 * jQuery mmenu konfigurieren
 */
function setSlideInMenu() {
    let cookie = getObjectFromCookie("session");
    user = cookie.user;

    $.get("/find/events", {
        "date": new Date().toJSON().slice(0, 10)
    }).then(function (result) {
        $("#menu").mmenu({
            navbar: {
                title: ""
            },
            navbars: [{
                position: "top",
                content: ["prev", "title"]
            }]
        });
        $(".mm-navbar__title").html(result.name);
        updateOutline();
    });
}

/**
 * Füllt Hooks der HTML Datei
 */
function setHooks() {
    setNodeHookFromFile($("#header-hook"), "../partials/header/header.html", undefined, undefined, "initHeader");
    setNodeHookFromFile($("#footer-hook"), "../partials/footer/footer.html");
    setNodeHookFromFile($("#content-hook"), "../partials/game-overview-content/game-overview-content.html", undefined, undefined, "initGameOverviewContent");
    setNodeHookFromFile($("#warning-hook"), "../partials/play-warning-box/play-warning-box.html", hideWarning);
}

//Selektiert den Cookie mit pCookieName vom aktuellen document
function getObjectFromCookie(pCookieName) {
    let cookieStrings = document.cookie.split(";");
    for (let i in cookieStrings) {
        cookieStrings[i] = cookieStrings[i].trim();
        if (cookieStrings[i].startsWith(pCookieName + "=")) {
            let cookieValue = cookieStrings[i].substr(pCookieName.length + 1);
            if (cookieValue.length > 0)
                return JSON.parse(atob(cookieValue));
        }
    }
}

//Setzt bzw. überschreibt einen Cookie
function setCookieFromObject(pObj, pCookieName) {
    let cookieStrings = document.cookie.split(";");

    for (let i in cookieStrings) {
        if (cookieStrings[i].trim().startsWith(pCookieName + "=")) {
            document.cookie = pCookieName + "=" + btoa(JSON.stringify(pObj));
        }
    }
}

function hideWarning() {
    $("#warning-box-message").html("Spielername: " + user.name + "<br/> PIN: " + user.token);

    if (!loginHintTimer) {
        loginHintTimer = setTimeout(function () {
            $("#warning-hook").fadeOut("slow", function () {
                $("#warning-hook").show().html("");
            });
        }, notificationFadeOut);
    }
}

//Wenn der Spieler sich ausloggen möchte wird ein
function setLogoutHint() {
    let timeleft = notificationFadeOut / 1000;
    // Main-Box ausblenden
    clearNodeHook("content-hook");
    // Warnung einblenden mit Usernamen und Token
    $("#warning-box-message").html("Spielername: " + user.name + "<br/> PIN: " + user.token);
    // Wenn ein Loginhiweis angezeigt wird, TImer für diesen stoppen
    if (loginHintTimer) {
        clearInterval(loginHintTimer);
    }
    // Hinweis-Box überschreiben
    if (!logoutHintTimer) {
        // Timer initialisieren
        $("#warning-box-hint").html("Logout in " + timeleft);
        // Countdown beginnen
        logoutHintTimer = setInterval(function () {
            // Runterzählen
            $("#warning-box-hint").html(("Logout in " + --timeleft));
            // Timer soll gestoppt werden wenn die Warning Box leer ist
            if (!$("#warning-box-message")) {
                clearInterval(this);
                logoutHintTimer = undefined;
            }
            // Wenn die Zeit null ist, den Timer stoppen und Ausloggen
            if (timeleft <= 0) {
                clearInterval(this);
                logoutHintTimer = undefined;
                $.get("sign-out").done(function () {
                    clearLocalCookies("session");
                    window.location = "sign-up";
                });
            }
        }, 1000);
    }

    // Bei Menüinteraktion soll der Timeout gestoppt werden
    $("#play-side-menu li a").on("click", function () {
        clearInterval(logoutHintTimer);
        logoutHintTimer = undefined;
        clearNodeHook("warning-hook");
    });
}

//Funktion um das Menü zu aktualisieren
function updateOutline() {
    let htmlString = "Spielername: " + user.name + "<br/> PIN: " + user.token;

    if (user.score) {
        htmlString += "<br/> Punkte: " + user.score.score + "<br/> Missionen: " + user.score.locations + "<br/> Spiele gespielt: " + user.score.games;
    }

    $('#play-user-information').html(htmlString);
}