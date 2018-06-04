/**
 * Handles Websocket bei Änderungen des Scores
 */
$(document).ready(function () {
    let sessioncookie = getObjectFromCookie("session");
    let webSocketProtocol = window.location.protocol.slice(0, -1) === 'https' ? 'wss' : 'ws';

    // Prüft ob Firefox (MozWebSocket) oder anderer Browser
    var Socket = "MozWebSocket" in window ? MozWebSocket : WebSocket;
    var ws = new Socket(webSocketProtocol + '://' + window.location.host + "/score");


    // Wenn der Punktestand an den aktuell User gerichtet ist, Score updaten
    ws.onmessage = function (evt) {
        let dto = JSON.parse(evt.data);
        if (dto.userId === sessioncookie.user._id) {
            user.score = dto.score;
            //UpdateOutline von play.js aufrufen
            updateOutline();
        }
    };
});