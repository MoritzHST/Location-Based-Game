/**
 * Handles Websocket on Sessions changes
 */
$(document).ready(function() {
    let sessioncookie = getObjectFromCookie("session");
    let webSocketProtocol = window.location.protocol.slice(0, -1) === 'https' ? 'wss' : 'ws';

    // Check if Firefox (MozWebSocket) or other Browser (WebSocket)
    var Socket = "MozWebSocket" in window ? MozWebSocket : WebSocket;
    var ws = new Socket(webSocketProtocol + '://' + window.location.host + "/session", 'echo-protocol');

    // Send User id on login to server
    ws.onopen = function() {
        ws.send([ sessioncookie.user._id, sessioncookie.login ]);
    };
    // If the data recieved is the same as the user._id, auto-logout
    ws.onmessage = function(evt) {
        let arrayData = evt.data.split(',');
        if (arrayData[0] === sessioncookie.user._id && arrayData[1] !== String(sessioncookie.login)) {
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