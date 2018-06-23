const router = require('express').Router();
const helper = require('../helper/routes/admin');

/* POST */
router.post('/admin/database', helper.dbAction);

module.exports = router;