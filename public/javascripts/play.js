window.onload = init;

$(function () {
    $('nav#menu').mmenu();
});

function init() {
    setHooks();
    //initialize SlideInMenu
    setSlideInMenu();
}

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
    const head = $('head');
    setNodeHookFromFile(head, document.getElementById("header-hook"), "../partials/header/header.html");
    setNodeHookFromFile(head, document.getElementById("footer-hook"), "../partials/footer/footer.html");
}