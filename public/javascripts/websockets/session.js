/**
 * Handles Websocket on Sessions changes
 */
$(document).ready(function() {
    let sessioncookie = getObjectFromCookie("session");

    // Check if Firefox (MozWebSocket) or other Browser (WebSocket)
    var Socket = "MozWebSocket" in window ? MozWebSocket : WebSocket;
    var ws = new Socket('ws://' + window.location.host + "/session", 'echo-protocol');

    // Send User id on login to server
    ws.onopen = function() {
        ws.send(sessioncookie.user._id);
    };
    // If the data recieved is the same as the user._id, auto-logout
    ws.onmessage = function(evt) {
        if (evt.data === sessioncookie.user._id) {
            $.get("sign-out").done(function() {
                clearLocalCookies();
                window.location = "sign-up?reason=login";
            });
        }

    };

    ws.onerror = function() {
        $.get("sign-out").always(function() {
            clearLocalCookies();
            window.location = "sign-up?reason=error";
        });
    };
});