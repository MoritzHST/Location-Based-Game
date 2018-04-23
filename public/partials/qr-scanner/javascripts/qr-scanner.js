let scanner;
let cameraList;
const qrUrl = "http://qr.service.fh-strasund.de/";

/**
 * initiates the scanner
 * register onCodeScanned as Callback for successful scans
 * initiates Cameralist-Object
 */
function initQRScanner() {
    scanner = new Instascan.Scanner({video: document.getElementById('preview'), mirror: false});
    Instascan.Camera.getCameras().then(function (cameras) {
        if (cameras.length > 0) {
            scanner.start(cameras[0]);
            cameraList = new CameraList(cameras);
        } else {
            console.error('Keine Kameras gefunden.');
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
 * This function should be called when a code is scanned successfully
 * @param content Content written in the scanned code
 */
function onCodeScanned(content) {
    if (content.startsWith(qrUrl)) {
        content.replace(qrUrl, "");
        ajaxRequest()
    }
}

/**
 * This Object wraps the camera-list that is called asynchronously and handles the camera-swap
 * @param cameras List of cameras that were found
 * @constructor  */
function CameraList(cameras) {
    this.cameras = cameras;
    this.currentCam = 0;
    /**
     * Starts the next possible cam from the List.
     */
    this.startNextCam = function () {
        let stoppingCam = this.cameras[this.currentCam];
        scanner.stop(stoppingCam);
        if (this.currentCam + 1 < this.cameras.length) {
            this.currentCam++;
        } else {
            this.currentCam = 0;
        }
        let startingCam = this.cameras[this.currentCam];
        scanner.start(startingCam);
    };
}