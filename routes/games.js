const router = require('express').Router();
const helper = require('../helper/routes/games');

/* Global */

/* GET */
/* Find games(s) */
router.get('/find/games', helper.findGames);

/* POST */
/* Insert games */
router.post('/insert/games', helper.insertGame);

/* Update games */
router.post('/update/games/:id', helper.updateGame);

/* Delete games(s) */
router.post('/delete/games', helper.deleteGame);

module.exports = router;