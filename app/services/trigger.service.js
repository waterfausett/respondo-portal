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
            const result = await executeQuery({
                name: 'triggers-getall',
                text: `SELECT id, trigger, response FROM "TriggerResponses" WHERE "guildId" = $1 ORDER BY trigger`, 
                values: [guildId]
            });
            return result ? result.rows : [];
        } catch (err) {
            logger.error(`${TAG}::getRows:`, err);
            throw err;
        }
    },

    addResponse: async (guildId, trigger, response) => {
        try {
            const insertResult = await executeQuery({
                name: 'triggers-add-response',
                text: `INSERT INTO "TriggerResponses" (trigger, response, "guildId") VALUES ($1, $2, $3) RETURNING id`,
                values: [sqlClean(trigger), sqlClean(response), guildId]
            });
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
            await executeQuery({
                name: 'triggers-update',
                text: `UPDATE "TriggerResponses" SET trigger = $1, response = $2 WHERE id = $3`,
                values: [sqlClean(obj.trigger), sqlClean(obj.response), id]
            });
        } catch (err) {
            logger.error(`${TAG}::updateTrigger:`, err);
            throw err;
        }
    },

    remove: async (id) => {
        try {
            await executeQuery({
                name: 'triggers-deleteById',
                text: `DELETE FROM "TriggerResponses" WHERE id = $1`,
                values: [id]
        });
        } catch (err) {
            logger.error(`${TAG}::remove:`, err);
            throw err;
        }
    }
};