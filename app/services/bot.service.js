const optionalRequire = require("optional-require")(require);
const authConfig = optionalRequire('../../config/auth.config.json');
// Required dependencies
const Discord = require('discord.io');
const NodeCache = require('node-cache');
const botCache = new NodeCache({ stdTTL: process.env.bot_server_cache_timeout || 60 * 60 }); // default cache ttl to 1 hour

module.exports = {
    getServers: async () => {
        const key = '__bot__guilds';
        const cachedServerIds = botCache.get(key);
    
        if (cachedServerIds) {
            return cachedServerIds;
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
        });
        botCache.set(key, botServerIds);
    
        return botServerIds;
    }
};