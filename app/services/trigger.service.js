const logger = require('./logging.service');
const TAG = 'Trigger.service';

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

function sqlClean(str) {
    return str.trim().replace(/\'/g, '\'$&');
}

async function executeQuery(query) {
    const client = await pool.connect();
    const result = await client.query(query);
    client.release();
    return result;
}

module.exports = {
    getRows: async (guildId) => {
        try {
            const result = await executeQuery(`SELECT id, trigger, response FROM "TriggerResponses" WHERE "guildId" = '${guildId}' ORDER BY trigger`);
            return result ? result.rows : [];
        } catch (err) {
            logger.error(`${TAG}::getRows:`, err);
            throw err;
        }
    },

    getTriggers: async (guildId) => {
        try {
            const result = await executeQuery(`SELECT trigger FROM "TriggerResponses" WHERE "guildId" = '${guildId}' ORDER BY trigger`);
            const results = (result) 
                ? result.rows.reduce((obj, v) => {
                    obj[v.trigger] = (obj[v.trigger] || 0) + 1;
                    return obj;
                  }, {})
                : {};
            return results;
        } catch (err) {
            logger.error(`${TAG}::getTriggers:`, err);
            throw err;
        }
    },

    getResponses: async (guildId) => {
        try {
            const result = await executeQuery(`SELECT id, trigger, response FROM "TriggerResponses" WHERE "guildId" = '${guildId}' ORDER BY trigger`);
            const results = (result) 
                ? result.rows.reduce((obj, v) => {
                    obj[v.trigger] = (obj[v.trigger] || []);
                    obj[v.trigger].push(v.response);
                    return obj;
                }, {})
                : {};
            return results;
        } catch (err) {
            logger.error(`${TAG}::getResponses:`, err);
            throw err;
        }
    },

    addResponse: async (guildId, trigger, response) => {
        let res = { isAllowed: true }; // TODO: have this guy just throw an error

        try {
            const insertResult = await executeQuery(`INSERT INTO "TriggerResponses" (trigger, response, "guildId") VALUES ('${sqlClean(trigger)}', '${sqlClean(response)}', '${guildId}') RETURNING id`);
            res.id = insertResult.rows[0].id;
        } catch (err) {
            if (err && err.constraint === 'UX_Trigger_Response_GuildId') {
                logger.warn(`${TAG}::addResponse:`, err);
                res.isAllowed = false;
            }
            else {
                logger.error(`${TAG}::addResponse:`, err);
                throw err;
            }
        }

        return res;
    },

    removeResponse: async (guildId, trigger, response) => {
        try {
            await executeQuery(`DELETE FROM "TriggerResponses" WHERE "guildId" = '${guildId}' AND trigger = '${sqlClean(trigger)}' AND response = '${sqlClean(response)}'`);
        } catch (err) {
            logger.error(`${TAG}::removeResponse:`, err);
            throw err;
        }
    },

    removeTrigger: async (guildId, trigger) => {
        try {
            await executeQuery(`DELETE FROM "TriggerResponses" WHERE "guildId" = '${guildId}' AND trigger = '${sqlClean(trigger)}'`);
        } catch (err) {
            logger.error(`${TAG}::removeTrigger:`, err);
            throw err;
        }
    },

    update: async (id, obj) => {
        try {
            await executeQuery(`UPDATE "TriggerResponses" SET trigger = '${sqlClean(obj.trigger)}', response = '${sqlClean(obj.response)}' WHERE id = ${id}`);
        } catch (err) {
            logger.error(`${TAG}::updateTrigger:`, err);
            throw err;
        }
    },

    remove: async (id) => {
        try {
            await executeQuery(`DELETE FROM "TriggerResponses" WHERE id = ${id}`);
        } catch (err) {
            logger.error(`${TAG}::remove:`, err);
            throw err;
        }
    }
};