$(document).ready(function () {
    //Setzt die Cookiebar
    if (!$("#cookie-bar").length) {
        $.cookieBar({
                message: "Die Seite <a href='/'>quiz.hochschule-stralsund.de</a> benutzt Cookies, um einzelne Spielelemente zu ermöglichen.\n" +
                "Weiterführende Informationen erhalten Sie in der <a href='/privacy'>Datenschutzerklärung</a>.\n",
                acceptText: "Ich habe verstanden!"
            }
        );
    }
});
