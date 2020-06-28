const express = require('express');
const router = express.Router();

const triggerService = require('../../services/trigger.service');

/* GET triggers */
router.get('/', async (req, res, next) => {
    const guildId = req.query.guildId;
    if (!guildId) {
        res.statusMessage = 'Bad Request: Query parameter "guildId" is required.';
        res.statusMessage(400).end();
        next();
    }

	res.json(guildId ? await triggerService.getRows(guildId) : []);
});

/* POST a trigger */
router.post('/', async (req, res, next) => {
    const addObj = req.body;
    const { isAllowed, id } = await triggerService.addResponse(addObj.guildId, addObj.trigger, addObj.response);
    if (isAllowed) {
        const newObj = Object.assign({id}, addObj);
        res.status(201).json(newObj);
        }
    else {
        res.statusMessage = 'Trigger/Response combo already exists!';
        res.status(409).end();
    }
});

/* PUT a trigger */
router.put('/:id', async (req, res, next) => {
    const id = req.params.id;
    const updateObj = req.body;
    await triggerService.update(id, updateObj)
    res.sendStatus(200);
});

/* DELETE a trigger */
router.delete('/:id', async (req, res, next) => {
    await triggerService.remove(req.params.id)
    res.sendStatus(200);
});

module.exports = router;