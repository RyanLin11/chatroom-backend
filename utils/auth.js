import User from '../schemas/user';

export async function isAuthenticated (req, res, next) {
    if (req.session.user) {
        const user = await User.findById(req.session.user);
        req.locals.user = user;
        next();
    } else {
        res.status(403).send('Not logged in.');
    }
}