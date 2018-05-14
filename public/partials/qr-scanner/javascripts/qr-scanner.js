var scanner;
var cameraList;

function initScanner() {
    scanner = new Instascan.Scanner(
        {video: document.getElementById('preview'), mirror: false}
    );
    Instascan.Camera.getCameras().then(function (cameras) {
        if (cameras.length > 0) {
            scanner.start(cameras[0]);
            cameraList = new CameraList(cameras);
        } else {
            console.error('No cameras found.');
        }
    }).catch(function (e) {
        console.error(e);
    });
    scanner.addListener('scan', onCodeScanned);

    document.getElementById("nextCam").onclick = function () {
        cameraList.startNextCam();
    }
}

/**
 * Callback der ausgeführt wird, wenn ein Code erfolgreich gescannt wurde
 * @param content Inhalt des QR-Codes
 */
function onCodeScanned(content) {
    //Scanner stoppen
    scanner.stop();

    ajaxRequest("find/scan", "GET", {"identifier": content}, function (obj) {
        //Bei Erfolg
        setNodeHookFromFile($("#content-hook"), "partials/exposition-info/exposition-info.html", undefined, undefined, "initExpositionInfo", obj);
    }, function (obj) {
        //Bei Misserfolg
        setNodeHookFromFile($("#failure-hook"), "partials/failure-box/failure-box.html", function (errMsgObj) {
            $("#failure-box-error-message").html(errMsgObj.responseJSON.error);
            //Nach Konstanter Sekunden-Anzahl wieder ausblenden
            setTimeout(function () {
                clearNodeHook("failure-hook");
            }, notificationFadeOut);
        }, obj);
        setNodeHookFromFile($("#content-hook"), "partials/game-overview-content/game-overview-content.html", undefined, undefined, "initGameOverviewContent")
    });
}

/**
 * Wrapper für das Kamera-Objekt
 * @param cameras List der möglichen Kameras
 * @constructor
 */
function CameraList(cameras) {
    this.cameras = cameras;
    this.currentCam = 0;

    /**
     * Startet die nächste mögliche Kamera
     */
    this.startNextCam = function () {
        var stoppingCam = this.cameras[this.currentCam];
        //scanner.stop(stoppingCam);
        console.log("stopped: " + stoppingCam.id);

        if (this.currentCam + 1 < this.cameras.length) {
            this.currentCam++;
        } else {
            this.currentCam = 0;
        }
        var startingCam = this.cameras[this.currentCam];
        scanner.start(startingCam);
        console.log("starting: " + startingCam.id);
    };
}