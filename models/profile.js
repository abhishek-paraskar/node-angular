
"use strict";

module.exports = function(sequelize, DataTypes) {
  var Profile = sequelize.define("Profile", {
    name: DataTypes.STRING
  }, {

    classMethods: {
      associate: function(models) {
          Profile.hasMany(models.User, { foreignKey: 'profile_id', as: 'profile'});
      }, 

      addProfile : function(profileName, callback){
          Profile.create({
              name: profileName
          }).then(function(profile) {
              callback({success: true});
          }).catch(function(error){
              callback({success : false, message : error});
          });
      },

      updateProfile : function(profileId, profileName, callback){
          Profile.update({
            name: profileName
          },{
            where : {
              id: profileId
            }
          }).then(function(holding) {
            callback({success: true});
          }).catch(function(error){
            callback({success : false, message : error});
          });
      },

      getProfileById : function(profileId, callback){
          Profile.findOne({
            where: {
              id: profileId
            }
        }).then(function(profile) {
            if(profile){
              callback({status : true, data : profile});
            } else {
              callback({status : false, message : 'Profile not found'});
            }
          }).catch(function(error){
            callback({success : false, message : error});
          });
      },

      deleteProfile : function(profileId, callback){
        Profile.destroy({
            where: {
              id: profileId
            }
        }).then(function() {
            callback({status : true});
        }).catch(function(error){
            callback({success : false, message : error});
        });
      },

      getAllProfiles : function(callback){
        Profile.findAll().then(function(profileList) {
            callback({success: true, data: profileList});
        }).catch(function(error){
            callback({success : false, message : error});
        });
      }
    }
  });
  return Profile;
};