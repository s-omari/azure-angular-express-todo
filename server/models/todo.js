const Joi = require("joi");

'use strict';
module.exports = (sequelize, DataTypes) => {
  const ToDo = sequelize.define('ToDo', {
    title: DataTypes.STRING,
    body: DataTypes.TEXT,
    isCompleted: DataTypes.BOOLEAN,
    userId: DataTypes.INTEGER
  }, {});
  ToDo.associate = function(models) {
    ToDo.belongsTo(models.User, {as: "user"});
  };
  return ToDo;
};

const ToDoSchema = Joi.object().keys({
  title: Joi.string().max(255).required(),
  body: Joi.string().max(65535).required(),
  isCompleted: Joi.bool()
});

const ToDoStateChangedSchema = Joi.object().keys({
  isCompleted: Joi.bool().required()
});

module.exports.ToDoSchema = ToDoSchema;
module.exports.ToDoStateChangedSchema = ToDoStateChangedSchema;
