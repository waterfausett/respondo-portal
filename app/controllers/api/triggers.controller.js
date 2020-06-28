const express = require('express');
const router = express.Router();

const triggerService = require('../../services/trigger.service');
const { runInThisContext } = require('vm');

/* GET triggers */
router.get('/', async (req, res, next) => {
    const guildId = req.query.guildId;
    if (!guildId) {
        res.statusMessage = 'Bad Request: Query parameter "guildId" is required.';
        res.statusMessage(400).end();
        return next();
    }

	res.json(guildId ? await triggerService.getRows(guildId) : []);
});

/* POST a trigger */
router.post('/', async (req, res, next) => {
    const addObj = req.body;
    if (!addObj || !addObj.trigger || !addObj.response) {
        res.statusMessage = 'Bad Request';
        res.statusMessage(400).end();
        return next();
    }

    try {
        const id = await triggerService.addResponse(addObj.guildId, addObj.trigger.toLowerCase(), addObj.response);
        const newObj = Object.assign(addObj, {id});
        res.status(201).json(newObj);
    } catch (error) {
        if (error && error.constraint === 'UX_Trigger_Response_GuildId') {
            res.statusMessage = 'Trigger/Response combo already exists!';
            res.status(409).end();
        } else throw error;
    }
});

/* PUT a trigger */
router.put('/:id', async (req, res, next) => {
    const id = req.params.id;
    const updateObj = req.body;
    if (!updateObj || !updateObj.trigger || !updateObj.response) {
        res.statusMessage = 'Bad Request';
        res.statusMessage(400).end();
        return next();
    }

    updateObj.trigger = updateObj.trigger.toLowerCase();
    await triggerService.update(id, updateObj)
    res.sendStatus(200);
});

/* DELETE a trigger */
router.delete('/:id', async (req, res, next) => {
    await triggerService.remove(req.params.id)
    res.sendStatus(200);
});

module.exports = router;