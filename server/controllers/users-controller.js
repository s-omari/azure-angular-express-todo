const express = require("express");
var bcrypt = require('bcrypt');
const User = require("../models/index")['User'];
const asyncWrapper = require("../utilities/async-wrapper").AsyncWrapper;
const jsonwebtoken = require("jsonwebtoken");
const Constants = require("../utilities/constants");
const AuthenticationError = require("../errors/authentication-error");
const ValidationError = require("../errors/validation-error");
const ValidatorMiddleware = require("../middleware/validator");

const router = express.Router();
const saltRounds = 10;

function generateAccessToken(user) {
    if (!user) {
        throw new Error("Invalid user");
    }
    userInfo = user.toJSON();
    delete userInfo.password;
    let payload = {
        user: userInfo
    };
    const token = jsonwebtoken.sign(payload, Constants.authSecret, {
        algorithm: "HS256",
        issuer: Constants.tokenIssuer,
        subject: `${user.id}`
    });
    return token;
}

async function checkIfEmailExists(email) {
    let user = await User.findOne({
        where: {
            email
        }
    });
    return user;
}

router.post("/signup", [ValidatorMiddleware("User")], asyncWrapper(async (req, res) => {
    let existingUser = await checkIfEmailExists(req.body.email);
    if(existingUser) {
        throw new ValidationError(`User with email: ${req.body.email} already exists`);
    }
    const password = await bcrypt.hash(req.body.password, saltRounds);
    const user = await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: password
    }); 
    res.send(generateAccessToken(user));
}));

router.post("/signin", [ValidatorMiddleware("User", "signIn")], asyncWrapper(async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    let user = await User.findOne({
        where: {
            email
        }
    });
    if(!user) {
        throw new AuthenticationError();
    }
    else {
        const result = await bcrypt.compare(password, user.password);
        if(result === true) {
            res.send(generateAccessToken(user));
        }
        else {
            throw new AuthenticationError();
        }
    }
}));

module.exports = router;