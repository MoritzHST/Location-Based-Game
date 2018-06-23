const router = require('express').Router();
const helper = require('../helper/routes/scorelist');

/* Global */

/**
 * gibt alle dem Nutzer zur Verfügung stehenden Missionen zurück
 *
 */
router.get('/get/scorelist', helper.getScorelist);

module.exports = router;