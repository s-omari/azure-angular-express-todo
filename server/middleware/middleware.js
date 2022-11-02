const CommonMiddleware = require("./common");
const ErrorHandlingMiddleware = require("./error-handling");
const AuthMiddleware = require("./auth");

module.exports = function MiddlewareManager(app, clientRoot) {
    CommonMiddleware(app, clientRoot);
    AuthMiddleware(app);
}