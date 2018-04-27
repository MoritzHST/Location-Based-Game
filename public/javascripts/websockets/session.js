/**
 * Handles Websocket on Sessions changes
 */
$(document).ready(function() {
    const cookie = getObjectFromCookie("session");

    // Added WebSocket Support
    // Check if Firefox (MozWebSocket) or other Browser (WebSocket)
    var Socket = "MozWebSocket" in window ? MozWebSocket : WebSocket;
    var ws = new Socket('ws://' + window.location.host + "/session", 'echo-protocol');

    // Send User id on login to server
    ws.onopen = function() {
        ws.send(cookie.user._id);
    };
    // If the data recieved is the same as the user._id, auto-logout
    ws.onmessage = function(evt) {
        if (evt.data === cookie.user._id) {
            $.get("sign-out").done(function() {
                clearLocalCookies();
                window.location = "sign-up";
            });
        }

    };
    ws.onerror = function() {
        $.get("sign-out").always(function() {
            clearLocalCookies();
            window.location = "sign-up";
        });
    };

    ws.onclose = function() {
        $.get("sign-out").always(function() {
            clearLocalCookies();
            window.location = "sign-up";
        });
    };
});