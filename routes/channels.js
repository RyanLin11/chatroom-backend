const Channel = require('../schemas/channel');
const User = require('../schemas/user');
const { isAuthenticated } = require('../utils/auth');
const express = require('express');
const router = express.Router();

router.use(isAuthenticated);

router.get('/', async function (req, res, next) {
    try {
        res.send(res.locals.user.channels);
    } catch (err) {
        next(err);
    }
});

router.post('/', async function (req, res, next) {
    try {
        let channel = new Channel(req.body);
        channel = await channel.save();
        for (const member of channel.participants) {
            const user = await User.findById(member).exec();
            user.channels.push(channel._id);
            await user.save();
        }
        res.send(channel);
    } catch (err) {
        next(err);
    }
});

router.post('/:channelId/add', async function(req, res, next) {
    try {
        let channel = await Channel.findById(req.params.channelId);
        let newMember = await User.findById(req.query.user);
        channel.participants.push(newMember._id);
        newMember.push(channel._id);
        await channel.save();
        await newMember.save();
        res.sendStatus(200);
    } catch (err) {
        next(err);
    }
});

router.post('/:channelId/leave', async function(req, res, next) {
    try {
        let channel = await Channel.findById(req.params.channelId);
        channel.participants = channel.participants.filter(member => member != res.locals.user._id);
        res.locals.user.channels = res.locals.user.channels.filter(group => group != channel._id);
        await res.locals.user.save();
        if (channel.participants.length == 0) {
            await Channel.findByIdAndDelete(channel._id);
        } else {
            await channel.save();
        }
        res.sendStatus(200);
    } catch (err) {
        next(err);
    }
});

module.exports = router;