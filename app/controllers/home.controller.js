var express = require('express');
var router = express.Router();

const triggerService = require('../services/trigger.service');

/* GET home page. */
router.get('/', async (req, res, next) => {
    const guildId = req.query.guildId; // TODO: prolly will move this to a dropdown at somepoint
	res.render('index', { 
        layout: 'shared/layout', 
        title: global.title, 
        activeTabClass: '.nav-link.home',
        user: req.user,
        data: guildId ? await triggerService.getRows(guildId) : []
    });
});

router.get('/*', (req, res) => {
    // TODO: create a 404 page and serve here
    throw new Error('not found');
});

module.exports = router;