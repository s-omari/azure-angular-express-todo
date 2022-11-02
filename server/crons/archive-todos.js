const moment = require("moment");
const ToDo = require("../models/index")['ToDo'];
const Op = require("sequelize").Op;

async function archiveOldToDos() {
    let oldToDos = await ToDo.findAll({
        where: {
            isCompleted: true,
            updatedAt: {
                [Op.lte]: moment().subtract(14, "days").format("YYYY M D")
            }   
        }
    });
    await Promise.all(oldToDos.map(oldToDo => oldToDo.destroy()));
}

archiveOldToDos().then(() => {
    console.log("Old todos deleted successfully")
    process.exit(0);
}).catch(err => {
    console.error("Failed to delete todos with error: ", err);
    process.exit(1);
});