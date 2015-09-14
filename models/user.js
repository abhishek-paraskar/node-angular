"use strict";
var bcrypt = require('bcrypt');
var uuid = require("node-uuid");
var jwt        = require("jsonwebtoken");

var env       = process.env.NODE_ENV || "development";
var config    = require('../config/config.json')[env];

var salt = bcrypt.genSaltSync(10);

var models = require("../models");
var utils = require("../utils/mailer");



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
    
    	},
      is_activated: {
        type : DataTypes.BOOLEAN(45),
        allowNull : false
      },
      activateion_link: {
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
               if (typeof userList[0] == "undefined") {
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
                    if(authenticatedUser.is_activated){
                      var payload = {
                        email: authenticatedUser.email,
                        name: authenticatedUser.name,
                        last_name: authenticatedUser.last_name,
                        id: authenticatedUser.id
                      }
                      var token = jwt.sign(payload, config.authSecret, {
                        expiresInMinutes: 10 // expires in 3 mins
                      });
                      callback({
                        success: true,
                        message: 'User is authenticated',
                        token: token
                      });
                    }else{

                      callback({
                        success: false,
                        message: 'You have not confirmed your email address yet. We have sent you the confirmation email at (' + authenticatedUser.email +').',
                        token: token
                      });
                    }
                  }else{
                    callback({ success: false, message: 'Authentication failed. Wrong password.' });
                  }
                }  
            }).catch(function(error){
              callback({ success: false, message: 'Authentication failed. Returning from catch block' });    
            });
          },


      		addUser : function(emailField, passwordField, nameField, lastNameField, profileIdField, holderIdField, isSignUp, callback){
            var activationCode = uuid.v1();
      			User.create({
              email: emailField,
              password: bcrypt.hashSync(passwordField, salt),
              name: nameField,
              last_name: lastNameField,
              profile_id: profileIdField,
              holding_id: holderIdField,
              is_activated: !isSignUp,
              activateion_link : activationCode
            }).then(function(user) {
                if(isSignUp){
                  utils.sendMail(emailField, activationCode, function(response){
                    callback(response);
                  });
                }else{
                    callback({ success: true});
                }
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

          activateUser : function(activationCode, callback){

          
            User.update({
              is_activated: true
            },{
              where : {
                activateion_link: activationCode
              }
            }).then(function(updateCount) {
              if(updateCount){
                callback({status : true,  message : 'Congratulations, your account has been activated.'});
              }else
                callback({success : false, message : 'We are not able to confirm your email address, please signup again.'});
            }).catch(function(error){
              callback({success : false, message : 'We are not able to confirm your email address, please signup again.', error: error});
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