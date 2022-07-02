const { messageSchema, updateMessageSchema } = require('../validation/messages');
const validate = require('../validation/validator');
const createError = require('http-errors');
const Message = require('../schemas/message');
const { isAuthenticated } = require('../utils/auth');
const express = require('express');
const router = express.Router();

router.use(isAuthenticated);

router.route('/')
    .get(async (req, res, next) => {
        try {
            let messages = await Message.find({channel: req.query.channel}).populate('sender').exec();
            res.send(messages);
        } catch (err) {
            next(err);
        }
    })
    .post(validate(messageSchema), async (req, res, next) => {
        req.body.sender = req.user._id;
        try {
            let message = new Message(req.body);
            message = await message.save();
            await message.populate('sender');
            res.status(201).send(message);
        } catch (err) {
            next(err);
        }
    });

router.param('messageId', async (req, res, next, id) => {
    try {
        req.message = await Message.findById(id);
        if (!req.message) {
            throw createError(400, 'Message not found');
        }
        next();
    } catch (err) {
        next(err);
    }
});

router.route('/:messageId')
    .get((req, res, next) => {
        res.send(req.message);
    })
    .put(validate(updateMessageSchema), async (req, res, next) => {
        if (req.user._id !== req.message.sender && req.user.role !== 'Admin') {
            throw createError(403, "Cannot modify another user's message");
        }
        try {
            let updated_message = await Message.findByIdAndUpdate(req.params.messageId, req.body);
            res.send(updated_message);
        } catch (err) {
            next(err);
        }
    })
    .delete(async (req, res, next) => {
        if (req.user._id !== req.message.sender && req.user.role !== 'Admin') {
            throw createError(403, "Cannot delete another user's message");
        }
        try {
            await Message.findByIdAndDelete(req.params.messageId);
            res.sendStatus(200);
        } catch (err) {
            next(err);
        }
    });

module.exports = router;