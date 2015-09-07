"use strict";

module.exports = function(sequelize, DataTypes) {
  var User_Reg = sequelize.define("User_Reg", {
    email: DataTypes.STRING,
    password: DataTypes.STRING
  });

  return User_Reg
};