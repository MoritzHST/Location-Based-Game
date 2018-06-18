/**
 * Handles Websocket bei Änderungen der Session
 */
$(document).ready(function() {
    let sessioncookie = getObjectFromCookie("session");
    let webSocketProtocol = window.location.protocol.slice(0, -1) === 'https' ? 'wss' : 'ws';

    // Prüft ob Firefox (MozWebSocket) oder anderer Browser
    var Socket = "MozWebSocket" in window ? MozWebSocket : WebSocket;
    var ws = new Socket(webSocketProtocol + '://' + window.location.host + "/session");

    // User id beim Login an den Server senden
    ws.onopen = function() {
        ws.send(JSON.stringify({
            userId : sessioncookie.user._id,
            login : sessioncookie.login
        }));
    };
    // Wenn sich irgendjemand mit den Nutzerdaten ausweist, abmelden
    ws.onmessage = function(evt) {
        let dto = JSON.parse(evt.data);
        if (dto.userId === sessioncookie.user._id && dto.login !== sessioncookie.login) {
            $.get("sign-out").done(function() {
                clearLocalCookies("session");
                window.location = "sign-up?reason=login";
            });
        }

    };

    ws.onerror = function() {
        $.get("sign-out").always(function() {
            clearLocalCookies("session");
            window.location = "sign-up?reason=error";
        });
    };
});