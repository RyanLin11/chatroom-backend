const { loginSchema } = require('../validation/auth');
const validator = require('../validation/validator');
const createError = require('http-errors');
const User = require('../schemas/user');
const { isAuthenticated } = require('../utils/auth');
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

router.post('/login', validator(loginSchema), async (req, res, next) => {
    try {
        const user = await User.findOne({username: req.body.username}).populate({path: 'channels', populate: {path: 'participants'}}).exec();
        if (!user) {
            throw createError(400, 'User not found');
        }
        const result = await new Promise((resolve, reject) => {
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
        if (!result) {
            throw createError(401, 'Incorrect Username or Password');
        }
        req.session.user = user._id;
        res.send(user);
    } catch(err) {
        next(err);
    }
});

router.get('/logout', isAuthenticated, async (req, res, next) => {
    try {
        req.session.user = null;
        await new Promise((resolve, reject) => {
            req.session.save((err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        await new Promise((resolve, reject) => {
            req.session.regenerate((err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        res.sendStatus(200);
    } catch (err) {
        next(err);
    }
});

module.exports = router;