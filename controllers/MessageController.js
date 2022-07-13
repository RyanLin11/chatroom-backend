const createError = require('http-errors');
const Message = require('../schemas/message');

class MessageController {

    static async getMessages (req, res, next) {
        try {
            let messages = await Message.find({channel: req.query.channel}).populate('sender').exec();
            res.send(messages);
        } catch (err) {
            next(err);
        }
    }

    static async createMessage (req, res, next) {
        req.body.sender = req.user._id;
        try {
            let message = new Message(req.body);
            message = await message.save();
            await message.populate('sender');
            res.status(201).send(message);
        } catch (err) {
            next(err);
        }
    }

    static async getMessage (req, res, next) {
        res.send(req.message);
    }

    static async editMessage (req, res, next) {
        if (req.user._id !== req.message.sender && req.user.role !== 'Admin') {
            throw createError(403, "Cannot modify another user's message");
        }
        try {
            let updated_message = await Message.findByIdAndUpdate(req.params.messageId, req.body);
            res.send(updated_message);
        } catch (err) {
            next(err);
        }
    }

    static async deleteMessage (req, res, next) {
        if (req.user._id !== req.message.sender && req.user.role !== 'Admin') {
            throw createError(403, "Cannot delete another user's message");
        }
        try {
            await Message.findByIdAndDelete(req.params.messageId);
            res.sendStatus(200);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = MessageController;