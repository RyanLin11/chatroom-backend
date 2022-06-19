import User from '../schemas/user';
import { isAuthenticated } from '../utils/auth';

var express = require('express');
var router = express.Router();

let bcrypt = require('bcrypt');

router.post('/register', async function (req, res, next) {
    try {
        const hashedPassword = await new Promise((resolve, reject) => {
            bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
                if (err) {
                    reject(err);
                } else {
                    resolve(hash);
                }
            });
        });
        let newUser = await new User({
            username: body.username,
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
            throw new Error('User not found');
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
            throw new Error('Incorrect Password');
        }
        await new Promise((resolve, reject) => {
            req.session.regenerate(function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        req.session.user = user._id;
        await new Promise((resolve, reject) => {
            req.session.save(function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        res.send(user);
    } catch(err) {
        return next(err);
    }
});

router.get('/logout', isAuthenticated, async function (req, res, next) {
    try {
        req.session.user = null;
        await new Promise((resolve, reject) => {
            req.session.save(function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        await new Promise((resolve, reject) => {
            req.session.regenerate(function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;