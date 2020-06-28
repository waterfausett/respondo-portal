const optionalRequire = require("optional-require")(require);
const authConfig = optionalRequire('../../../config/auth.config.json');
// Required dependencies
const express = require('express');
const router = express.Router();

// TODO: this prolly deserves to be split out to it's own file
const Discord = require('discord.io');

const BOT_SERVER_CACHE_DEFAULT_TIMEOUT = 60 * 60 * 1000; // One hour in milliseconds
const _botServerCache = { serverIds: [], lastFetch: null };

async function fetchBotServers() {
    const cacheTimeout = process.env.bot_server_cache_timeout || BOT_SERVER_CACHE_DEFAULT_TIMEOUT;
    
    if (_botServerCache.lastFetch && _botServerCache.serverIds.length !== 0 && (cacheTimeout - (Date.now() - _botServerCache.lastFetch)) > 0) {
        return _botServerCache.serverIds;
    }

    const botServerIds = await new Promise((resolve, reject) => {
        var bot = new Discord.Client({
            token: process.env.auth_token || authConfig.auth_token,
            autorun: true
        });
        bot.on('ready', (evt) => {
            resolve(Object.keys(bot.servers));
            bot.disconnect();
        });
    })
    _botServerCache.lastFetch = Date.now();
    _botServerCache.serverIds = botServerIds;

    return botServerIds;
}

/* GET guilds */
router.get('/guilds', async (req, res, next) => {
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

    const botServers = await fetchBotServers();

	res.json(userServers.filter(x => botServers.includes(x.id)));
});

module.exports = router;