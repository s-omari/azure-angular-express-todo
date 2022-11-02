const express = require("express");
const path = require("path");
const middleware = require("./middleware/middleware");
const errorHandlingMiddleware = require("./middleware/error-handling");

// Controllers
const UsersController = require("./controllers/users-controller");
const ToDosController = require('./controllers/todos-controller');

const app = express();
const clientRoot = path.join(__dirname, "..", "/client/dist/packt-app-service");

middleware(app, clientRoot);

app.use("/api/users", UsersController);
app.use("/api/todos", ToDosController);

app.get("/", (req, res) => {
    res.sendFile(`${clientRoot}/index.html`);
});

errorHandlingMiddleware(app);

app.listen(9000, () => {
    console.log("Server running on port 9000");
});