const express = require('express');
const router = express.Router();
const { ensureLoggedIn } = require('connect-ensure-login');

router.use(require('./auth.controller'));

router.use(/*ensureLoggedIn(),*/ require('./home.controller'));

module.exports = router;