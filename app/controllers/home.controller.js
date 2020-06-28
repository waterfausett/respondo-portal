var express = require('express');
var router = express.Router();

const triggerService = require('../services/trigger.service');

/* GET home page. */
router.get('/', async (req, res, next) => {
	res.render('index', { 
        layout: 'shared/layout', 
        title: global.title, 
        activeTabClass: '.nav-link.home',
        user: req.user
    });
});

module.exports = router;