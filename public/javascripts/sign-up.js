window.onload = init;

function init() {

    setHooks();

    //Tabs setzen
    $(function () {
        $("#signup_signin_switch").tabs();
    });

}

/**
 * Füllt Hooks der HTML Datei
 */
function setHooks() {
    setNodeHookFromFile($('head'), document.getElementById("header-hook"), "../partials/header/header.html");
}