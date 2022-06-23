const createError = require('http-errors');
const User = require('../schemas/user');
const { isAuthenticated } = require('../utils/auth');
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const saltRounds = 10;

router.post('/register', async function (req, res, next) {
    try {
        const hashedPassword = await new Promise((resolve, reject) => {
            bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
                if (err) {
                    reject(createError(400, err));
                } else {
                    resolve(hash);
                }
            });
        });
        let newUser = await new User({
            username: req.body.username,
            password: hashedPassword,
        }).save();
        res.send(newUser);
    } catch (err) {
        next(err);
    }
});

router.post('/login', async function (req, res, next) {
    try {
        const user = await User.findOne({username: req.body.username}).exec();
        if (!user) {
            throw createError(400, 'User not found');
        }
        const result = await new Promise((resolve, reject) => {
            bcrypt.compare(req.body.password, user.password, function(err, result) {
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
        return next(err);
    }
});

router.get('/logout', isAuthenticated, async function (req, res, next) {
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