const passport = require("passport");

function isAuthenticated(req, res, next) {
    passport.authenticate("session", { session: false }, (error, user, info) => {
        if (error) return next(error);
        if (!user) {
            req.user = null;
        } else {
            req.user = user;
        }
        next();
    })(req, res, next);
}

module.exports = isAuthenticated;
