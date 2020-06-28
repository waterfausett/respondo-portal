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

    addResponse: async (guildId, trigger, response) => {
        try {
            const insertResult = await executeQuery(`INSERT INTO "TriggerResponses" (trigger, response, "guildId") VALUES ('${sqlClean(trigger)}', '${sqlClean(response)}', '${guildId}') RETURNING id`);
            return insertResult.rows[0].id;
        } catch (err) {
            if (err && err.constraint === 'UX_Trigger_Response_GuildId') {
                logger.warn(`${TAG}::addResponse:`, err);
            }
            else {
                logger.error(`${TAG}::addResponse:`, err);
            }
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