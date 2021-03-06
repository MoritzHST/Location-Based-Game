var scanner;
var cameraList;
var scannerContext;

/**
 * initialisiert den QR-Scanner
 * https://github.com/schmich/instascan
 * @param pContextObj "beschreibt die View, aus der der QR-Scanner geöffnet wurde
 */
function initScanner(pContextObj) {
    // Variablen Clearen
    scanner = undefined;
    cameraList = undefined;
    scannerContext = undefined;

    scannerContext = pContextObj;

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
    };
}

/**
 * Callback der ausgeführt wird, wenn ein Code erfolgreich gescannt wurde
 * @param content Inhalt des QR-Codes
 */
function onCodeScanned(content) {
    // Scanner stoppen
    scanner.stop();

    $.get("find/scan", {"identifier": btoa(content)})
        .done(function (obj) {
            // Bei Erfolg
            obj.context = GameViewContext.CODE_SCANNED;
            setNodeHookFromFile($("#content-hook"), "partials/exposition-info/exposition-info.html", undefined, undefined, "initExpositionInfo", obj);
        })
        .fail(function (obj) {
            // Bei Misserfolg
            setNodeHookFromFile($("#failure-hook"), "partials/failure-box/failure-box.html", function (errMsgObj) {
                $("#failure-box-error-message").html(errMsgObj.responseJSON.error);
                // Nach Konstanter Sekunden-Anzahl wieder ausblenden
                setTimeout(function () {
                    clearNodeHook("failure-hook");
                }, notificationFadeOut);
            }, obj);
            // Von welcher View aufgerufen? Dahin zurückleiten!
            if (scannerContext.context === GameViewContext.SCAN_ATTEMPT_FROM_PLAY_OVERVIEW) {
                setNodeHookFromFile($("#content-hook"), "partials/game-overview-content/game-overview-content.html", undefined, undefined, "initGameOverviewContent");
            }
            else {
                scannerContext.context = GameViewContext.CODE_PENDING;
                setNodeHookFromFile($("#content-hook"), "partials/exposition-info/exposition-info.html", undefined, undefined, "initExpositionInfo", scannerContext);
            }
        });

}

/**
 * Wrapper für das Kamera-Objekt
 * @param cameras List der möglichen Kameras
 * @constructor
 */
function CameraList(cameras) { // NOSONAR
    this.cameras = cameras;
    this.currentCam = 0;

    /**
     * Startet die nächste mögliche Kamera
     */
    this.startNextCam = function () {
        if (this.currentCam + 1 < this.cameras.length) {
            this.currentCam++;
        } else {
            this.currentCam = 0;
        }
        let startingCam = this.cameras[this.currentCam];
        scanner.start(startingCam);
    };
}