const optionalRequire = require("optional-require")(require);
const authConfig = optionalRequire('../../../config/auth.config.json');
// Required dependencies
const express = require('express');
const router = express.Router();
const cache = require('../../middleware/cache.middleware');
const botService = require('../../services/bot.service');

/* GET guilds */
router.get('/guilds', cache.forUser(30), async (req, res, next) => {
    const userServers = await fetch('https://discord.com/api/users/@me/guilds',{
        headers: {
            'Authorization': `Bearer ${req.user.accessToken}`
        }
    }).then((response) => {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    }).then(res => res.json());

    const botServers = await botService.getServers();

	res.json(userServers.filter(x => botServers.includes(x.id)));
});

module.exports = router;