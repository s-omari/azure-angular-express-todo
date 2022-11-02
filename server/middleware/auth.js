const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt
const User = require("../models/index")["User"];
const Constants = require("../utilities/constants");


module.exports = function AuthMiddleware(app) {
    // Middleware
    const authStrategy = new JwtStrategy({
        secretOrKey: Constants.authSecret,
        algorithms: ["HS256"],
        issuer: Constants.tokenIssuer,
        ignoreExpiration: false,
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer')
    }, async (payload, done) => {
        console.log("Running strategy");
        id = parseInt(payload.sub);
        try {
            let user = await User.findOne({
                where: {
                    id
                }
            });
            if (user) {
                done(null, user.toJSON());
            } else {
                done(null, false);
            }
        } catch (err) {
            done(err);
        }
    });
    passport.use(authStrategy);
    app.use(passport.initialize());
}