const createError = require('http-errors');
const User = require('../schemas/user');

async function isAuthenticated (req, res, next) {
    if (req.session.user) {
        const user = await User.findById(req.session.user);
        req.user = user;
        next();
    } else {
        next(createError(403, 'Authentication Failed'));
    }
}

module.exports = { isAuthenticated };