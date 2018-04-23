window.onload = init;

function init() {

    setHooks();

    // Register-Button Funktion registrieren
    $("#btn-sign-up").click(function() {
        const textfieldName = $("#textfield-name-sign-up");
        const name = textfieldName.val() === "" || textfieldName.val() === undefined ? "" : "name=" + textfieldName.val();
        ajaxRequest("insert/users?", "POST", name, redirectOnSuccess, displayFailureMessage);
        $(this).addClass('disabled');
    });

    // Tabs setzen
    $(function() {
        $("#signup_signin_switch").tabs();
    });

    // Enabled Disabled Status für Pflichtfeld AGB's setzen
    const checkAGB = $("#checkAGB");

    checkAGB.on("click", function() {
        if (!this.checked) {
            $("#btn-sign-up").addClass('disabled');

        } else {
            $("#btn-sign-up").removeClass("disabled");
        }
    });

    // Checkbox onload disabled
    checkAGB.prop("checked", false);

}

/**
 * Füllt Hooks der HTML Datei
 */
function setHooks() {
    setNodeHookFromFile(document.getElementById("header-hook"), "../partials/header/header.html");
    setNodeHookFromFile(document.getElementById("footer-hook"), "../partials/footer/footer.html");
}

/**
 * Callback, welches bei erfolgreichem AJAX-Registrierungs-Aufruf ausgeführt werden soll
 */
function redirectOnSuccess(user) {
    $.post("login", user.value).done(function() {
        window.location = "play";
    });
}

/**
 * Callback, welches bei nicht erfolgreichem AJAX-Registierungs-Aufruf ausgeführt werden soll
 * @param callbackObj "Objekt, welches beim AJAX-Aufruft erzeugt wurde
 */
function displayFailureMessage(callbackObj) {
    setNodeHookFromFile(document.getElementById("sign-up-in-failure-box-hook"), "../partials/sign-up-in-failure-box/sign-up-in-failure-box.html", function (pObj) {
        document.getElementById("sign-up-in-failure-box-error-message").innerHTML = pObj.responseJSON.error;
    }, callbackObj);

    // Fehler aufgetreten -> registrieren Button wieder aktivieren
    $("#btn-sign-up").removeClass("disabled");

}
