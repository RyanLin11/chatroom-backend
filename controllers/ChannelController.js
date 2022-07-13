const createError = require('http-errors');
const Message = require('../schemas/message');
const User = require('../schemas/user');
const Channel = require('../schemas/channel');
const { io } = require('../utils/socketApi');

class ChannelController {
    static async getChannels(req, res, next) {
        try {
            await req.user.channels.populate('participants');
            res.send(req.user.channels);
        } catch(err) {
            next(err);
        }
    }

    static async createChannel(req, res, next) {
        try {
            let channel = new Channel(req.body);
            channel = await channel.save();
            await User.updateMany({'_id': { $in: channel.participants }}, { $push: { channels: channel._id }});
            await channel.populate('participants');
            const participant_ids = channel.participants.map(participant => participant._id.toString());
            io.to(participant_ids).emit('add-channel', channel);
            res.send(channel);
        } catch (err) {
            next(err);
        }
    }

    static async getChannel(req, res, next) {
        try {
            await req.channel.populate('participants');
            res.send(req.channel);
        } catch (err) {
            next(err);
        }
    }

    static async deleteChannel(req, res, next) {
        try {
            if (req.user._id === req.channel.admin || req.user.role === 'Admin') {
                const deleted_channel = await Channel.findByIdAndDelete(req.params.channelId);
                await User.updateMany({ '_id': { $in: deleted_channel.participants } }, { $pull: { channels: req.params.channelId } });
                res.sendStatus(200);
            } else {
                throw createError(403, 'You do not have permissions to delete this channel.');
            }
        } catch (err) {
            next(err);
        }
    }

    static async joinChannel(req, res, next) {
        try {
            await Channel.findByIdAndUpdate(req.params.channelId, { $addToSet: { participants: req.user._id }});
            await User.findByIdAndUpdate(req.user._id, { $addToSet: { channels: req.params.channelId }});
            res.sendStatus(200);
        } catch (err) {
            next(err);
        }
    }
    
    static async leaveChannel(req, res, next) {
        try {
            await Channel.findByIdAndUpdate(req.params.channelId, { $pull: { participants: req.user._id }});
            await User.findByIdAndUpdate(req.user._id, { $pull: { channels: req.params.channelId } });
            if (req.channel.participants.length == 0) {
                await Channel.findByIdAndDelete(req.channel._id);
            }
            await Message.deleteMany({sender: req.user._id, channel: req.params.channelId});
            res.sendStatus(200);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = ChannelController;