var express = require('express');
var bodyParser = require('body-parser')
var router = express.Router();
var models = require("../models");
var env       = process.env.NODE_ENV || "development";
var config    = require('../config/config.json')[env];
var jwt        = require("jsonwebtoken");


// ---------------------------------------------------------
// authentication (no middleware necessary since this isnt authenticated)
// ---------------------------------------------------------
// http://localhost:8080/api/authenticate
router.post('/authenticate', function(req, res) {
	console.log(req.body.email);
	models.User.findOne({
		where: {
			email: req.body.email
		}
	}).success(function(user) {
		if (!user) {
			res.json({ success: false, message: 'Authentication failed. User not found.' });
		} else if (user) {
			// check if password matches
			if (user.password != req.body.password) {
				res.json({ success: false, message: 'Authentication failed. Wrong password.' });
			} else {
				// if user is found and password is right
				// create a token
				
				var token = jwt.sign(user, config.authSecret, {
					expiresInMinutes: 1440 // expires in 24 hours
				});
				//var token = "custom-token";

				res.json({
					success: true,
					message: 'User is authenticated',
					token: token
				});
			}
		}	
  	});
});

/* Add new user to database. */
router.post('/sign-up', function(req, res, next) {
	models.User.create({
		name: req.body.first_name,
		email: req.body.email,
		password: req.body.password,
		last_name: req.body.last_name,
		profile: req.body.profile,
		holding: req.body.holding
	}).then(function(user) {
    	res.json({
            success: true
        });
  	});
});

module.exports = router;
