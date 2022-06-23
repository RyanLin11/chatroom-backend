const Comment = require('../schemas/user');
const { isAuthenticated } = require('../utils/auth');
const express = require('express');
const router = express.Router();

router.use(isAuthenticated);

router.get('/', async function (req, res, next) {
    try {
        let comments = await Comment.find({channel: req.params.channel}).exec();
        res.send(comments);
    } catch (err) {
        next(err);
    }
});

router.post('/', async function (req, res, next) {
    try {
        let comment = new Comment(req.body);
        comment = await comment.save();
        res.status(201).send(comment);
    } catch (err) {
        next(err);
    }
});

router.put('/:commentId', async function (req, res, next) {
    try {
        let updated_comment = await Comment.findByIdAndUpdate(req.params.commentId, req.body).exec();
        res.send(updated_comment);
    } catch (err) {
        next(err);
    }
});

router.delete('/:commentId', async function (req, res, next) {
    try {
        await Comment.findByIdAndDelete(req.params.commentId);
        res.sendStatus(200);
    } catch (err) {
        next(err);
    }
});

module.exports = router;