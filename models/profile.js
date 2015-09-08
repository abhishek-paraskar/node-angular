
"use strict";

module.exports = function(sequelize, DataTypes) {
  var Profile = sequelize.define("Profile", {
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Profile.hasMany(models.User, { foreignKey: 'profile_id', allowNull : false});
      }
    }
  });
  return Profile;
};