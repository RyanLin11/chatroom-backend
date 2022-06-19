import Channel from '../schemas/channel';
import User from '../schemas/user';
import { isAuthenticated } from '../utils/auth';

var express = require('express');
var router = express.Router();

router.use(isAuthenticated);

router.get('/', async function (req, res, next) {
    return req.locals.user.channels;
});

router.post('/', async function (req, res, next) {
    try {
        let channel = new Channel(req.body);
        channel = await channel.save();
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
        channel.participants = channel.participants.filter(member => member != req.locals.user._id);
        req.locals.user.channels = req.locals.user.channels.filter(group => group != channel._id);
        await req.locals.user.save();
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