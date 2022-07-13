const createError = require('http-errors');
const MessageController = require('../controllers/MessageController');
const { messageSchema, updateMessageSchema } = require('../validation/messages');
const validate = require('../validation/validator');
const { isAuthenticated } = require('../utils/auth');
const express = require('express');
const router = express.Router();
const Message = require('../schemas/message');

router.use(isAuthenticated);

router.route('/')
    .get(MessageController.getMessages)
    .post(validate(messageSchema), MessageController.createMessage);

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
    .get(MessageController.getMessage)
    .put(MessageController.editMessage)
    .delete(MessageController.deleteMessage);

module.exports = router;