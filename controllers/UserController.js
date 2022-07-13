const _ = require('lodash');
const createError = require('http-errors');
const bcrypt = require('bcrypt');
const User = require('../schemas/user');
const Channel = require('../schemas/channel');
const Message = require('../schemas/message');

const ACCESSIBLE_FIELDS = ['_id', 'username', 'display_name', 'image', 'channels'];
const SALT_ROUNDS = 10;

class UserController {

    static async getAllUsers (req, res, next) {
        try {
            let allUsers = await User.find().select(ACCESSIBLE_FIELDS).populate('channels').exec();
            res.send(allUsers);
        } catch (err) {
            next(err);
        }
    }

    static async getUser (req, res, next) {
        try {
            let user = await User.findById(req.params.userId).select(ACCESSIBLE_FIELDS).populate('channels');
            if (!user) {
                throw createError(400, 'User not found');
            }
            res.send(user);
        } catch (err) {
            next(err);
        }
    }

    static async createUser (req, res, next) {
        try {
            // Usernames must be unique
            const db_user_exists = await User.exists({username: req.body.username});
            if (db_user_exists) {
                throw createError(400, `User with username "${req.body.username}" already exists.`);
            }
            // Assign roles: Only admins can give other users Admin roles
            if (req.user && req.user.role === 'Admin' && req.body.role === 'Admin') {
                req.body.role = 'Admin';
            } else {
                req.body.role = 'User';
            }
            // Hash the password
            req.body.password = await new Promise((resolve, reject) => {
                bcrypt.hash(req.body.password, SALT_ROUNDS, (err, hash) => {
                    if (err) {
                        reject(createError(400, err));
                    } else {
                        resolve(hash);
                    }
                });
            });
            // Save user and send
            let user = await new User(req.body).save();
            await user.populate('channels');
            user = _.pick(user, ACCESSIBLE_FIELDS);
            res.send(user);
        } catch (err) {
            next(err);
        }
    }

    static async editUser (req, res, next) {
        try {
            // Users cannot modify other users unless they have the admin role
            if (req.user._id != req.params.userId && req.user.role !== 'Admin') {
                throw createError(403, 'You do not have the permissions to modify another user');
            }
            // Users cannot change other users' roles
            if (req.user.role !== 'Admin') {
                delete req.body.role;
            }
            // Update the user
            let user = await User.findByIdAndUpdate(req.params.userId, req.body).select(ACCESSIBLE_FIELDS).populate('channels');
            // If user is null, there is no user with userId as id
            if (!user) {
                throw createError(400, 'User not found');
            }
            // Send the modified user as response
            res.send(user);
        } catch (err) {
            next(err);
        }
    }

    static async deleteUser (req, res, next) {
        try {
            // Only admins can delete, and they cannot delete themselves
            if (req.user.role !== 'Admin' || req.user._id == req.params.userId) {
                throw createError(403, 'You do not have the permission to delete this user');
            }
            // Only Admin can delete users, and all users cannot delete themselves
            let deleted_user = await User.findByIdAndDelete(req.params.userId).populate('channels');
            // If user is null, there is no user with userId as id
            if (!deleted_user) {
                throw createError(400, 'User not found');
            }
            // Remove deleted user from all channels
            await Channel.updateMany({'_id': { $in: deleted_user.channels }}, { $pullAll: { participants: deleted_user._id }});
            // Remove all of the deleted user's messages
            await Message.deleteMany({sender: deleted_user._id});
            // Send 200 to indicate success
            res.sendStatus(200);
        } catch (err) {
            next(err);
        }
    }

    static async login (req, res, next) {
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
    }

    static async logout (req, res, next) {
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
    }
}

module.exports = UserController;