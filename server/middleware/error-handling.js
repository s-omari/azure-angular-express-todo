const chalk = require("chalk");
const ValidationError = require("../errors/validation-error");
const AuthenticationError = require("../errors/authentication-error");

function errorLogger(err, req, res, next) {
    if(err.message) {
        console.log(chalk.red(err.message));
    }
    if(err.stack) {
        console.log(chalk.red(err.stack));
    }
    next(err);
}

function authenticationErrorHandler(err, req, res, next) {
    if (err instanceof AuthenticationError) {
        return res.sendStatus(401);
    }
    next(err);
}

function validationErrorHandler(err, req, res, next) {
    if (err instanceof ValidationError) {
        return res.status(400).send(err.message);
    }
    next(err);
}

function genericErrorHandler(err, req, res, next) {
    res.sendStatus(500);
    next();
}

module.exports = function ErrorHandlingMiddleware(app) {
    app.use([errorLogger, authenticationErrorHandler, validationErrorHandler, genericErrorHandler]);
}