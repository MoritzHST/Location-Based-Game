const router = require('express').Router();
const helper = require('../helper/routes/events');

/* Global */

/* GET */
/**
 * Gibt ein oder alle Events aus der Datenbak aus.
 * @param req Request mit JSON-Query, welche Informationen zum gesuchten Event enthält. Ist diese NULL, so werden alle Events ausgegeben.
 * @param res Result Status, welcher unter anderem den return-Code enthält
 * @returns Genau einen oder mehrere Events (oder eine Fehlermeldung)
 */
router.get('/find/events', helper.findEvents);

/* POST */
/**
 * Fügt ein Event der Datenbank hinzu. Ist der Name oder das Datum bereits in der Datenbank vorhanden,
 * wird das Event nicht angelegt und ein Fehler zurückgegeben
 * @param req Request mit JSON-Query, welche Informationen zum gesuchten Event enthält
 * @param res Result Status, welcher unter anderem den return-Code enthält
 * @returns Das hinzugefügte Event (oder eine Fehlermeldung)
 */
router.post('/insert/events', helper.insertEvent);

/**
 * Aktualisiert ein Eventobjekt. Ist der Name oder das Datum bereits in der Datenbank vorhanden,
 * wird das Event nicht angelegt und ein Fehler zurückgegeben
 * @param req Request mit JSON-Query, welche Informationen zum gesuchten Evebt enthält.
 * @param res Result Status, welcher unter anderem den return-Code enthält
 * @returns Das aktualisierte Event
 */
router.post('/update/events/:id', helper.updateEvent);

/**
 * Löscht ein oder mehrere Events aus der Datenbank.
 * @param req Request mit JSON-Query, welche Informationen zum gesuchten Event enthält.
 * @param res Result Status, welcher unter anderem den return-Code enthält
 * @returns Das gelöschte Event
 */
router.post('/delete/events', helper.deleteEvent);

module.exports = router;