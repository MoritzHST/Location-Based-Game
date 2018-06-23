const router = require('express').Router();
const helper = require('../helper/routes/expositions');

/* Global */

/* GET */
/* Gibt eine oder alle Ausstellungen zurück */
router.get('/find/expositions', helper.findExpositions);

/* POST */
/* Fügt eine Ausstellung der Datenbank hinzu */
router.post('/insert/expositions', helper.insertExposition);

/* Aktualisiert eine Ausstellung mit einer bestimmten id */
router.post('/update/expositions/:id', helper.updateExposition);

/* Löscht eine Ausstellung */
router.post('/delete/expositions', helper.deleteExposition);

module.exports = router;