var express = require('express');
var bodyParser = require('body-parser')
var router = express.Router();
var models = require("../models");


// ---------------------------------------------------------
// authentication (no middleware necessary since this isnt authenticated)
// ---------------------------------------------------------
// http://localhost:8080/api/authenticate
router.post('/authenticate', function(req, res) {
	console.log(req.query.email);
	console.log(User)
	User.findOne({
		where: {
			email: req.query.email
		}
	}).success(function(user) {
		if (!user) {
			res.json({ success: false, message: 'Authentication failed. User not found.' });
		} else if (user) {
			// check if password matches
			if (user.password != req.query.password) {
				res.json({ success: false, message: 'Authentication failed. Wrong password.' });
			} else {
				// if user is found and password is right
				// create a token
				/*
				var token = jwt.sign(user, config.secret, {
					expiresInMinutes: 1440 // expires in 24 hours
				});*/
				var token = "custom-token";

				res.json({
					success: true,
					message: 'User is authenticated',
					token: token
				});
			}
		}	
  	});
});

/* Add contact to database. */
router.post('/sign-up', function(req, res, next) {
	console.log("Name - " + req.body.first_name);
	console.log("Email - " + req.body.email);
	console.log("Last Name - " + req.body.last_name);
	console.log("Password - " + req.body.password);
	console.log("Profile - " + req.body.profile);
	console.log("Holding - " + req.body.holding);
	models.User.create({
		name: req.body.first_name,
		email: req.body.email,
		password: req.body.password,
		last_name: req.body.last_name,
		profile: req.body.profile,
		holding: req.body.holding
	}).then(function(user) {
		var token = "custom-token";
    	res.json({
            success: true,
            data: user,
            token: token
        });
  	});
});


/* Add contact to database. */
router.get('/test', function(req, res, next) {
	
	var token = "custom-token";
	res.json({
        success: true,
        token: token
    });
});


module.exports = router;
