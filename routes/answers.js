const router = require('express').Router();
const helper = require('../helper/routes/answers');

/* Global */

/* Post */
/* Verarbeitet eine vom Benutzer gegebene Antwort*/
router.post('/post/answer', helper.postAnswer);

/* Get */
/* Prüft, ob der Raum abgeschlossen ist
 * Wenn ja, wird dem User ein Objekt mit Antworten zu den Spielen ausgegeben */
router.get('/get/answers', helper.getAnswer);

module.exports = router;