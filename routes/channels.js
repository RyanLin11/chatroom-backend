const createError = require('http-errors');
const Channel = require('../schemas/channel');
const ChannelController = require('../controllers/ChannelController');
const { isAuthenticated } = require('../utils/auth');
const express = require('express');
const router = express.Router();
const validator = require('../validation/validator');
const { channelSchema } = require('../validation/channels');

router.use(isAuthenticated);

router.route('/')
    .get(ChannelController.getChannels)
    .post(validator(channelSchema), ChannelController.createChannel);

router.param('channelId', async (req, res, next) => {
    try {
        req.channel = await Channel.findById(req.params.channelId);
        if (req.channel) {
            next();
        } else {
            next(createError(400, 'Channel not found'));
        }
    } catch (err) {
        next(err);
    }
});

router.route('/:channelId')
    .get(ChannelController.getChannel)
    .delete(ChannelController.deleteChannel);

router.post('/:channelId/join', ChannelController.joinChannel);

router.post('/:channelId/leave', ChannelController.leaveChannel);

module.exports = router;