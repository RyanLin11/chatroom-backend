const createError = require('http-errors');
const User = require('../schemas/user');

async function isAuthenticated (req, res, next) {
    console.log(req.session);
    if (req.session.user) {
        const user = await User.findById(req.session.user);
        res.locals.user = user;
        next();
    } else {
        next(createError(403, 'Authentication Failed'));
    }
}

module.exports = { isAuthenticated };