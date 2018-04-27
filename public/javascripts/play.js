window.onload = init;
let user;
/*
 * $(document).ready(function() { const cookie = getObjectFromCookie("session");
 * createSocket("session", 'echo-protocol', null, function(evt) { if (evt.data
 * === cookie.user._id) { $.get("sign-out").done(function() { window.location =
 * "sign-up"; }); } }); });
 */

/* -------------------- */

$(function() {
    $('nav#menu').mmenu();
});

function init() {
    user = {};
    // initialize SlideInMenu
    setSlideInMenu();

    setHooks();

    $("#game-logout").on("click", function() {
        $.get("sign-out").done(function() {
            clearLocalCookies();
            window.location = "sign-up";
        });
    });

    $("#game-room-map").on("click", function() {
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
        navbar : {
            title : ""
        },
        navbars : [ {
            position : "top",
            content : [ "prev", "title" ]
        } ]
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
    setNodeHookFromFile(document.getElementById("warning-hook"), "../partials/play-warning-box/play-warning-box.html", hideWarning());
}

function getObjectFromCookie(pCookieName) {
    const cookieStrings = document.cookie.split(";");
    for ( let i in cookieStrings) {
        if (cookieStrings[i].startsWith(pCookieName)) {
            return JSON.parse(atob(cookieStrings[i].substr(pCookieName.length + 1)));
        }
    }
}

function hideWarning() {
    if (document.readyState === 'complete') {
        setTimeout(function() {
            $("#warning-hook").html("");
        }, 10000);
    }

}