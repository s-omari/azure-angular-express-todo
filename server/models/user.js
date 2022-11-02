const Joi = require("joi");

"use strict";
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
  });
  User.associate = function(models) {
    User.hasMany(models.ToDo, {as: "todos"});
  };

  return User;
};

const schema = Joi.object().keys({
  firstName: Joi.string().alphanum().min(2).max(30).required(),
  lastName: Joi.string().alphanum().min(2).max(30).required(),
  email: Joi.string().email({minDomainAtoms: 2}).required(),
  password: Joi.string().min(8).max(32).required()
});

const signInSchema = Joi.object().keys({
  email: Joi.string().email({minDomainAtoms: 2}).required(),
  password: Joi.string().required()
});

module.exports.UserSchema = schema;
module.exports.UserSignInSchema = signInSchema;