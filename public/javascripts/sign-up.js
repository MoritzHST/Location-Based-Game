window.onload = init;

function init() {

    setHooks();

    //Register-Button Funktion registrieren
    $("#btn-sign-up").click(function () {
        let $textfieldName = $("#textfield-name-sign-up");
        const name = ($textfieldName.val() == "" || $textfieldName.val() == undefined) ? "" : "name=" + $textfieldName.val();
        ajaxRequest("insert/users?", "POST", name, redirectOnSuccess, displayFailureMessage);
    });

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

function redirectOnSuccess() {
    window.location = "game-overview.html";
}

function displayFailureMessage(callbackObj) {
    setNodeHookFromFile($('head'), document.getElementById("sign-up-in-failure-box-hook"), "../partials/sign-up-in-failure-box/sign-up-in-failure-box.html", function (pObj) {
        document.getElementById("sign-up-in-failure-box-error-message").innerHTML = pObj.responseJSON.error;
    }, callbackObj);

}
