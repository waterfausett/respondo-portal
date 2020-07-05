const optionalRequire = require("optional-require")(require);
const authConfig = optionalRequire('../../config/auth.config.json');
// Required dependencies
const Discord = require('discord.js');
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
            const bot = new Discord.Client();

            bot.once('ready', () => {
                resolve([...bot.guilds.cache.keys()]);
                bot.destroy();
            });
            
            bot.on('error', (err) => logger.error(err));
            
            bot.login(process.env.auth_token || authConfig.auth_token);
        });

        botCache.set(key, botServerIds);
    
        return botServerIds;
    }
};