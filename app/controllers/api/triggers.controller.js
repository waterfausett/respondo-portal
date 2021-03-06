const express = require('express');
const router = express.Router();

const triggerService = require('../../services/trigger.service');

/* GET triggers */
router.get('/', async (req, res, next) => {
    const guildId = req.query.guildId;
    if (!guildId) {
        res.statusMessage = 'Bad Request: Query parameter "guildId" is required.';
        res.statusMessage(400).end();
        return next();
    }

    triggerService.getRows(guildId)
        .then(rows => res.json(rows))
        .catch(error => next(error));
});

/* POST a trigger */
router.post('/', async (req, res, next) => {
    const addObj = req.body;
    if (!addObj || !addObj.trigger || !addObj.response) {
        res.statusMessage = 'Bad Request';
        res.statusMessage(400).end();
        return;
    }

    try {
        addObj.trigger = addObj.trigger.toLowerCase();
        const id = await triggerService.addResponse(addObj.guildId, addObj.trigger, addObj.response);
        const newObj = Object.assign(addObj, {id});
        res.status(201).json(newObj);
    } catch (error) {
        if (error && error.constraint === 'UX_Trigger_Response_GuildId') {
            res.statusMessage = 'Trigger/Response combo already exists!';
            res.status(409).end();
        } else next(error);
    }
});

/* PUT a trigger */
router.put('/:id', async (req, res, next) => {
    const id = req.params.id;
    const updateObj = req.body;
    if (!updateObj || !updateObj.trigger || !updateObj.response) {
        res.sendStatus(400);
        return;
    }

    updateObj.trigger = updateObj.trigger.toLowerCase();
    const updatedRows = await triggerService.update(id, updateObj)

    if (updatedRows === 0) {
        res.sendStatus(404);
        return;
    }

    res.sendStatus(200);
});

/* DELETE a trigger */
router.delete('/:id', async (req, res, next) => {
    await triggerService.remove(req.params.id)
    res.sendStatus(200);
});

module.exports = router;