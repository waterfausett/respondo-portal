const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth.middleware');

router.use('/triggers', auth.required, require('./triggers.controller'));
router.use('/discord', auth.required, require('./discord.controller'));

module.exports = router;