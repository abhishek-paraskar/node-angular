"use strict";

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    profile: DataTypes.STRING,
    holding: DataTypes.STRING
  });

  return User;
};