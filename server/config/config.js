const Constants = require("../utilities/constants");
const Op = require("sequelize").Op;

module.exports = {
    development: {
        username: Constants.mysqlUsername,
        password: Constants.mysqlPassword,
        database: Constants.mysqlDatabase,
        host: Constants.mysqlHost,
        port: Constants.mysqlPort,
        dialect: "mysql",
        operatorsAliases: Op
    },
    production: {
        username: "dimlucas",
        password: "packtAppService",
        database: "mytodolistjs",
        host: "packt-app-service.mysql.database.azure.com",
        port: 3306,
        dialect: "mysql",
        operatorsAliases: Op
    }
}