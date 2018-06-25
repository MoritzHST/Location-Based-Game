const router = require('express').Router();
const helper = require('../helper/routes/scans');

/* Global */

/**
 * Behandelt eine Scan-Anfrage.
 * Dabei wird überprüft ob zu diesem Event ein Minispiel für die angefragte Location freigeschaltet wurde.
 * Zudem wird geprüft, ob der user bereits an dieser Location war. Sollte dies nicht der Fall sien, wird ihm
 * das dem entsprechende Visit-Objekt angehangen.
 * Die Antwort entspricht einem leicht veränderten LocationMappingObjekt, an dem, eine der Fragestellung
 * entsprechende Anzahl an Antworten und Fragen, sowie bei noch nicht beantworteten Fragen,
 * den Antworten keinerlei Informationen über ihre Richtigkeit angehangen sind.
 */
router.get('/find/scan', helper.findScans);

module.exports = router;