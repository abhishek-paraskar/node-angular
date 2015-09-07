"use strict";

module.exports = function(sequelize, DataTypes) {
  var Contact = sequelize.define("Contact", {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    number: DataTypes.STRING
  });

  return Contact;
};