const router = require('express').Router();
const helper = require('../helper/routes/locations');

/* Global */

/* GET */
/* Gibt ein oder alle Location(s) zurück */
router.get('/find/locations', helper.findLocations);

/* POST */
/* Fügt eine Location der Datenbank hinz */
router.post('/insert/locations', helper.insertLocations);

/* Aktualisiert eine Location mit einer bestimmten id */
router.post('/update/locations/:id', helper.updateLocations);

/* Löscht Location(s) */
router.post('/delete/locations', helper.deleteLocations);



module.exports = router;