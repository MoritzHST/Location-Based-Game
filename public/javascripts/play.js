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

    $("#game-play-overview").on("click", function () {
        setNodeHookFromFile(document.getElementById("content-hook"), "../partials/game-overview-content/game-overview-content.html", undefined, undefined, "initGameOverviewContent");
    });

    $("#game-logout").on("click", function () {
        setNodeHookFromFile(document.getElementById("warning-hook"), "../partials/play-warning-box/play-warning-box.html", setLogoutHint);
    });

    $("#game-room-map").on("click", function () {
        setNodeHookFromFile(document.getElementById("content-hook"), "../partials/room-map/room-map.html", undefined, undefined, "initRoomMap");
    });
}

/**
 * jQuery mmenu konfigurieren
 */
function setSlideInMenu() {
    const cookie = getObjectFromCookie("session");
    user.name = cookie.user.name;
    user.token = cookie.user.token;
    $("#menu").mmenu({
        navbar: {
            title: ""
        },
        navbars: [{
            position: "top",
            content: ["prev", "title"]
        }]
    });

    $('#play-user-information').html("Name: " + user.name + "<br/> Token: " + user.token);
}

/**
 * Füllt Hooks der HTML Datei
 */
function setHooks() {
    setNodeHookFromFile(document.getElementById("header-hook"), "../partials/header/header.html");
    setNodeHookFromFile(document.getElementById("footer-hook"), "../partials/footer/footer.html");
    setNodeHookFromFile(document.getElementById("content-hook"), "../partials/game-overview-content/game-overview-content.html", undefined, undefined, "initGameOverviewContent");
    setNodeHookFromFile(document.getElementById("warning-hook"), "../partials/play-warning-box/play-warning-box.html", hideWarning);
}

function getObjectFromCookie(pCookieName) {
    const cookieStrings = document.cookie.split(";");
    for (let i in cookieStrings) {
        if (cookieStrings[i].startsWith(pCookieName)) {
            return JSON.parse(atob(cookieStrings[i].substr(pCookieName.length + 1)));
        }
    }
}

function hideWarning() {
    $("#warning-box-message").html("Name: " + user.name + "<br/> Token: " + user.token);

    if (!loginHintTimer) {
        loginHintTimer = setTimeout(function () {
            $("#warning-hook").html("");
        }, 10000)
    }
}

function setLogoutHint() {
    let timeleft = 10;
    //Main-Box ausblenden
    clearNodeHook("content-hook");
    //Warnung einblenden mit Usernamen und Token
    $("#warning-box-message").html("Name: " + user.name + "<br/> Token: " + user.token);
    //Wenn ein Loginhiweis angezeigt wird, TImer für diesen stoppen
    if (loginHintTimer) {
        clearInterval(loginHintTimer);
    }
    //Hinweis-Box überschreiben
    if (!logoutHintTimer) {
        //Timer initialisieren
        $("#warning-box-hint").html("Logout in " + timeleft);
        //Countdown beginnen
        logoutHintTimer = setInterval(function () {
            //Runterzählen
            $("#warning-box-hint").html(("Logout in " + --timeleft));
            //Timer soll gestoppt werden wenn die Warning Box leer ist
            if (!$("#warning-box-message")) {
                clearInterval(this);
                logoutHintTimer = undefined;
            }
            //Wenn die Zeit null ist, den Timer stoppen und Ausloggen
            if (timeleft <= 0) {
                clearInterval(this);
                logoutHintTimer = undefined;
                $.get("sign-out").done(function () {
                    window.location = "sign-up";
                });
            }
        }, 1000);
    }

    //Bei Menüinteraktion soll der Timeout gestoppt werden
    $("#play-side-menu li a").on("click", function () {
        clearInterval(logoutHintTimer);
        logoutHintTimer = undefined;
        clearNodeHook("warning-hook");
    });
}