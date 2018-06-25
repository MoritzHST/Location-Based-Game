const router = require('express').Router();
const helper = require('../helper/routes/images');

/* Global */

/* GET */
/**
 * Gibt einen oder alle Bilder aus der Datenbak aus.
 * @param req Request mit JSON-Query, welche Informationen zum gesuchten Bild enthält. Ist diese NULL, so werden alle Bilder ausgegeben.
 * @param res Result Status, welcher unter anderem den return-Code enthält
 * @returns Genau einen oder mehrere Bilder (oder eine Fehlermeldung)
 */
router.get('/find/images', helper.findImages);

/* POST */
/**
 * Fügt ein Bildobjekt der Datenbank hinzu
 * @param req Request mit JSON-Query, welche Informationen zum gesuchten Bild enthält
 * @param res Result Status, welcher unter anderem den return-Code enthält
 * @returns Das hinzugefügt Bild (oder eine Fehlermeldung)
 */
router.post('/insert/images', helper.insertImage);

/**
 * Aktualisiert ein Bildobjekt. Ist der Name nicht erlaubt oder bereits in der Datenbank vorhanden,
 * wird das Bild nicht aktualisiert und ein Fehler zurückgegeben
 * @param req Request mit JSON-Query, welche Informationen zum gesuchten Benutzer enthält.
 * @param res Result Status, welcher unter anderem den return-Code enthält
 * @returns Das aktualisierte Bild
 */
router.post('/update/images/:id', helper.updateImage);

/**
 * Löscht ein Bild aus der Datenbank.
 * @param req Request mit JSON-Query, welche Informationen zum gesuchten Bild enthält.
 * @param res Result Status, welcher unter anderem den return-Code enthält
 * @returns Das gelöschte Bild
 */
router.post('/delete/images', helper.deleteImage);

module.exports = router;