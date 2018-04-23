window.onload = init;
let user;

$(function() {
    $('nav#menu').mmenu();
});

function init() {
    user = {};
    setHooks();
    // initialize SlideInMenu
    setSlideInMenu();
}

/**
 * jQuery mmenu konfigurieren
 */
function setSlideInMenu() {
    const cookie = getObjectFromCookie("session");
    const userName = cookie.user.name;
    const userToken = cookie.user.token;
    $("#menu").mmenu({
        navbar : {
            title : ""
        },
        navbars : [ {
            position : "top",
            content : [ "prev", "title" ]
        } ]
    });

    $('#play-user-information').html("Name: " + userName + "<br/> Token: " + userToken);
}

/**
 * Füllt Hooks der HTML Datei
 */
function setHooks() {
    setNodeHookFromFile(document.getElementById("header-hook"), "../partials/header/header.html");
    setNodeHookFromFile(document.getElementById("footer-hook"), "../partials/footer/footer.html");
    setNodeHookFromFile(document.getElementById("content-hook"), "../partials/game-overview-content/game-overview-content.html", undefined, undefined, "initGameOverviewContent");
}

function getObjectFromCookie(pCookieName) {
    const cookieStrings = document.cookie.split(";");
    for ( let i in cookieStrings) {
        if (cookieStrings[i].startsWith(pCookieName)) {
            return JSON.parse(atob(cookieStrings[i].substr(pCookieName.length + 1)));
        }
    }
}
