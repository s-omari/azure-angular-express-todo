const express = require("express");
const ToDo = require("../models/index")['ToDo'];
const asyncWrapper = require("../utilities/async-wrapper").AsyncWrapper;
const protectedRoute = require("../middleware/protected-route");
const ValidatorMiddleware = require("../middleware/validator");
const VerifyOwnershipMiddleware = require("../middleware/verifyOwnership");

const router = express.Router();

router.use(protectedRoute());

router.get('/', asyncWrapper(async (req, res) => {
    const user = req.user;
    let todos = await ToDo.findAll({
        where: {
            userId: user.id
        }
    });
    res.send(todos);
}));

router.post('/', [ValidatorMiddleware("ToDo")], asyncWrapper(async (req, res) => {
    const user = req.user;
    let todo = await ToDo.create({
        title: req.body.title,
        body: req.body.body,
        isCompleted: req.body.isCompleted ? req.body.isCompleted : false,
        userId: user.id
    });
    res.status(200).send(todo);
}));

// Update everything (title, body, isCompleted)
router.put('/:id', [ValidatorMiddleware("ToDo"), VerifyOwnershipMiddleware("ToDo")], asyncWrapper(async(req, res) => {
    const todo = req.todo;
    todo.title = req.body.title;
    todo.body = req.body.body;
    todo.isCompleted = req.body.isCompleted;
    let updated = await todo.save();
    res.status(200).send(updated);
}));

// Update just the isCompleted field
router.patch('/:id', [ValidatorMiddleware("ToDo", "stateChanged"), VerifyOwnershipMiddleware("ToDo", "params.id")], asyncWrapper(async (req, res) => {
    let todo = req.todo;
    todo.isCompleted = req.body.isCompleted;
    let updated = await todo.save();
    delete updated.user;
    res.status(200).send(updated);
}));

router.delete('/:id', [VerifyOwnershipMiddleware("ToDo", "params.id")], asyncWrapper(async (req, res) => {
    await req.todo.delete();
    res.status(200).send({});
}));

module.exports = router;