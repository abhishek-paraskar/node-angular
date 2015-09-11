"use strict";
var bcrypt = require('bcrypt');
var jwt        = require("jsonwebtoken");
var env       = process.env.NODE_ENV || "development";
var config    = require('../config/config.json')[env];

var salt = bcrypt.genSaltSync(10);

var models = require("../models");

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", 
  	{
    	email: {
    		type : DataTypes.STRING(45),
    		allowNull : false
    	},
    	password: {
    		type: DataTypes.STRING,
    		allowNull : false
    	},
    	name: {
    		type : DataTypes.STRING(45),
    		allowNull : false
    	},

    	last_name: {
    		type : DataTypes.STRING(45),
    		allowNull : false
    
    	}
	}, {
    	classMethods: {
          associate: function(models) {
            User.belongsTo(models.Profile, { foreignKey: 'profile_id', as: 'profile' });
            User.belongsTo(models.Holding, { foreignKey: 'holding_id', as: 'holding' });
          },
      	validateUser : function(emailField, passwordField, callback){
            User.findAll({
                  where: { email: emailField },
                  raw : true
            }).then(function(userList) {
               if (!userList) {
                  callback({ success: false, message: 'Authentication failed. User not found.' });
                } else {
                  var useAuthenticated = false;
                  var authenticatedUser = {};
                  userList.forEach(function(user){
                    if (bcrypt.compareSync(passwordField, user.password)) {
                      useAuthenticated = true;
                      authenticatedUser = user;
                      return authenticatedUser;
                    } 
                  });
                  if(useAuthenticated){
                    var payload = {
                      email: authenticatedUser.email,
                      name: authenticatedUser.name,
                      last_name: authenticatedUser.last_name,
                      id: authenticatedUser.id
                    }
                    var token = jwt.sign(payload, config.authSecret, {
                      expiresInMinutes: 1 // expires in 3 mins
                    });
                    callback({
                      success: true,
                      message: 'User is authenticated',
                      token: token
                    });
                  }else{
                    callback({ success: false, message: 'Authentication failed. Wrong password.' });
                  }
                }  
            }).catch(function(error){
              callback({ success: false, message: 'Authentication failed. Returning from catch block' });    
            });
          },


      		addUser : function(emailField, passwordField, nameField, lastNameField, profileIdField, holderIdField, callback){
      			User.create({
              email: emailField,
              password: bcrypt.hashSync(passwordField, salt),
              name: nameField,
              last_name: lastNameField,
              profile_id: profileIdField,
              holding_id: holderIdField
            }).then(function(user) {
                callback({ success: true});
            }).catch(function(error){
              callback({success : false, message : 'Unable to add user.', error: error});
            });
      		},

          updateUser : function(userId, emailField, nameField, lastNameField, profileIdField, holderIdField, updateToken, callback){
            User.update({
              email: emailField,
              name: nameField,
              last_name: lastNameField,
              profile_id: profileIdField,
              holding_id: holderIdField
            },{
              where : {
                id: userId
              }
            }).then(function(updatedResults) {
              if(updateToken){
                var payload = {
                  email: emailField,
                  name: nameField,
                  last_name: lastNameField,
                  id: userId
                }
                var token = jwt.sign(payload, config.authSecret, {
                  expiresInMinutes: 10 // expires in 3 mins
                });
                callback({success: true, data: updatedResults, token: token});
              }else{
                callback({success: true, data: updatedResults});
              }
            }).catch(function(error){
              callback({success : false, message : 'Unable to update the user.', error: error});
            });
          },

          getUserById : function(userId, callback){
            User.findOne({
              where: {
                id: userId
              },
              raw: true, 
              attributes : ['id', 'email', 'name', 'last_name', 'profile_id', 'holding_id']
              
            }).then(function(user) {
              if(user){
                callback({status : true, data : user});
              }else
                callback({success : false, message : 'User not found.'});
            }).catch(function(error){
              callback({success : false, message : 'User not found.', error: error});
            });
          },

          deleteUser : function(userId, callback){
            User.destroy({
              where: {
                id: userId
              }
            }).then(function() {
              callback({status : true});
            }).catch(function(error){
              callback({success : false, message : 'Unable to delete the user.', error: error});
            });
          },

          getAllUsers : function(models, callback){
            User.findAll({
              raw: true, 
              attributes : ['id', 'email', 'name', 'last_name', 'profile_id', 'holding_id'], 
              include: [{
                model: models.Profile, 
                as : "profile",
                attributes : ['name']
              }, {
                model: models.Holding, 
                as : "holding",
                attributes : ['name']
              }]
            }).then(function(userList) {
              callback(userList);
            }).catch(function(error){
              callback({success : false, message : 'Unable to fetch the user list.', error: error});
            });
          }
    	}
  	});
    return User;
};