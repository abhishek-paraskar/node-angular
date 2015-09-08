"use strict";
var bcrypt = require('bcrypt');
var jwt        = require("jsonwebtoken");
var env       = process.env.NODE_ENV || "development";
var config    = require('../config/config.json')[env];

var salt = bcrypt.genSaltSync(10);



module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", 
  	{
    	email: {
    		type : DataTypes.STRING(45),
    		allowNull : false
    	},
    	password: {
    		type: DataTypes.STRING,
    		allowNull : false,
    		set : function(value){
    			this.setDataValue('password', bcrypt.hashSync(value, salt));
    		}
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
      		validateUser : function(emailField, passwordField, callback){
      			User.findOne({where: { email: emailField }}).success(function(user) {
      					if (!user) {
      						callback({ success: false, message: 'Authentication failed. User not found.' });
      					} else if (user) {
      			
      						if (!bcrypt.compareSync(passwordField, user.password)) {
      							callback({ success: false, message: 'Authentication failed. Wrong password.' });
      						} else {
      							// if user is found and password is right create a token
      							var token = jwt.sign(user, config.authSecret, {
      								expiresInMinutes: 3 // expires in 3 mins
      							});
      							callback({
      								success: true,
      								message: 'User is authenticated',
      								token: token
      							});
      						}
      					}	
      			 });
      		},

      		addUser : function(emailField, passwordField, nameField, lastNameField, profileIdField, holderIdField, callback){
      			models.User.create({
              email: emailField,
              password: passwordField,
              name: nameField,
              last_name: lastNameField,
              profile_id: profileIdField,
              holding_id: holderIdField
            }).then(function(user) {
                callback({
                      success: true
                  });
            }).catch(function(error){
              callback({success : false, message : error});
            });
      		},

          updateUser : function(userId, emailField, passwordField, nameField, lastNameField, profileIdField, holderIdField, callback){
            models.User.update({
              email: emailField,
              password: passwordField,
              name: nameField,
              last_name: lastNameField,
              profile_id: profileIdField,
              holding_id: holderIdField
            },{
              where : {
                id: userId
              }
            }).then(function(user) {
              callback({success: true});
            }).catch(function(error){
              callback({success : false, message : error});
            });
          },

          getUserById : function(userId, callback){
            models.User.findOne({
              where: {
                id: userId
              }
            }).then(function(user) {
              if(user)
                callback.json(status : true, data : user);
              else
                callback.json(status : false, message : 'User not found');
            }).catch(function(error){
              callback({success : false, message : error});
            });
          },

          deleteUser : function(userId, callback){
            models.User.destroy({
              where: {
                id: userId
              }
            }).then(function() {
              callback.json(status : true,);
            }).catch(function(error){
              callback({success : false, message : error});
            });
          },

          getAllUsers : function(callback){
            models.User.findAll().then(function(userList) {
                callback({
                      type: true,
                      data: contactList
                  });
            }).catch(function(error){
              callback({success : false, message : error});
            });
          }
    	}
  	});
  return User;
};