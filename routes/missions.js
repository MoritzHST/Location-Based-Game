const router = require('express').Router();
const helper = require('../helper/routes/missions');

/* Global */

/**
 * gibt alle dem Nutzer zur Verfügung stehenden Missionen zurück
 *
 */
router.get('/find/missions', helper.findMissions);

module.exports = router;