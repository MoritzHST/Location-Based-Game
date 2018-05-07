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
    ajaxRequest("find/scan", "GET", {"identifier": content}, function (obj) {
        console.log(obj);
    }, function (obj) {
        console.log(obj);
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