
"use strict";

module.exports = function(sequelize, DataTypes) {
  var Holding = sequelize.define("Holding", {
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Holding.hasMany(models.User, { foreignKey: 'holding_id', allowNull : false});
      }
    }
  });
  return Holding;
};