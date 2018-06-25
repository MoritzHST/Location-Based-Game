const router = require('express').Router();
const helper = require('../helper/routes/users');

/* Global */

/* GET */
/**
 * Gibt einen oder alle Benutzer aus der Datenbak aus.
 * @param req Request mit JSON-Query, welche Informationen zum gesuchten Benutzer enthält. Ist diese NULL, so werden alle Benutzer ausgegeben.
 * @param res Result Status, welcher unter anderem den return-Code enthält
 * @returns Genau einen oder mehrere Benutzer (oder eine Fehlermeldung)
 */
router.get('/find/users', helper.findUsers);

/* POST */
/**
 * Fügt einem Benutzer der Datenbank hinzu. Ist der Name nicht erlaubt oder bereits in der Datenbank vorhanden,
 * wird der Benutzer nicht angelegt und ein Fehler zurückgegeben
 * @param req Request mit JSON-Query, welche Informationen zum gesuchten Benutzer enthält
 * @param res Result Status, welcher unter anderem den return-Code enthält
 * @returns Den hinzugefügten Benutzer (oder eine Fehlermeldung)
 */
router.post('/insert/users', helper.insertUser);

/**
 * Aktualisiert ein Benutzerobjekt. Ist der Name nicht erlaubt oder bereits in der Datenbank vorhanden,
 * wird der Benutzer nicht aktualisiert und ein Fehler zurückgegeben
 * @param req Request mit JSON-Query, welche Informationen zum gesuchten Benutzer enthält.
 * @param res Result Status, welcher unter anderem den return-Code enthält
 * @returns Den aktualisierten Benutzer
 */
router.post('/update/users/:id', helper.updateUser);

/**
 * Löscht einen Benutzer aus der Datenbank.
 * @param req Request mit JSON-Query, welche Informationen zum gesuchten Benutzer enthält.
 * @param res Result Status, welcher unter anderem den return-Code enthält
 * @returns Der gelöschte Benutzer
 */
router.post('/delete/users', helper.deleteUser);

module.exports = router;