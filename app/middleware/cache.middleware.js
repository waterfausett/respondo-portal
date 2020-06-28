const NodeCache = require('node-cache');
const logger = require('../services/logging.service');

const cache = new NodeCache({ stdTTL: 5 * 60 }); // default cache ttl to 5 minutes

module.exports = {
    /**
     * Cache a route.
     *
     * @param {number} duration - route cache ttl (seconds)
     */
    route: (duration) => {
        return (req, res, next) => {
            const key = `__express__${(req.originalUrl || req.url)}`;
            const cachedBody = cache.get(key);
            if (cachedBody) {
                res.send(cachedBody);
                return;
            }
            else {
                res.sendResponse = res.send;
                res.send = (body) => {
                    cache.set(key, body, duration);
                    res.sendResponse(body);
                }
                next();
            }
        }
    },

    /**
     * Cache a route for a user. 
     * 
     * The userId will be part of the cache key.
     *
     * @param {number} duration - route cache ttl (seconds)
     */
    forUser: (duration) => {
        return (req, res, next) => {
            const userId = req.user.id;
            if (!userId) {
                logger.warn('Attempted to cache a route for a user with no user present: ', req.originalUrl || req.url);
                next();
                return;
            }

            const key = `__express__${userId}__${(req.originalUrl || req.url)}`;
            const cachedBody = cache.get(key);
            if (cachedBody) {
                res.send(cachedBody);
                return;
            }
            else {
                res.sendResponse = res.send;
                res.send = (body) => {
                    cache.set(key, body, duration);
                    res.sendResponse(body);
                }
                next();
            }
        }
    }
};