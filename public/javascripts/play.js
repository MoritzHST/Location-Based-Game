window.onload = init;
let user;

$(function () {
    $('nav#menu').mmenu();
});

function init() {
    user = {};
    setHooks();
    //initialize SlideInMenu
    setSlideInMenu();
}

/**
 * jQuery mmenu konfigurieren
 */
function setSlideInMenu() {
    $("#menu").mmenu({
        navbar: {
            title: ""
        },
        navbars: [{
            position: "top",
            content: ["prev", "title"]
        }]
    });
}

/**
 * Füllt Hooks der HTML Datei
 */
function setHooks() {
    setNodeHookFromFile(document.getElementById("header-hook"), "../partials/header/header.html");
    setNodeHookFromFile(document.getElementById("footer-hook"), "../partials/footer/footer.html");
    setNodeHookFromFile(document.getElementById("content-hook"), "../partials/game-overview-content/game-overview-content.html", undefined, undefined, "initGameOverviewContent");
}