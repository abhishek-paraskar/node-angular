var express = require('express');
var bodyParser = require('body-parser')
var router = express.Router();
var models = require("../models");
var env       = process.env.NODE_ENV || "development";
var config    = require('../config/config.json')[env];

// ---------------------------------------------------------
// authentication (no middleware necessary since this isnt authenticated)
// ---------------------------------------------------------
// http://localhost:8080/api/authenticate
router.post('/authenticate', function(req, res) {
	console.log("Email - - " + req.body.email);
	models.User.validateUser(req.body.email, req.body.password, function(response){
		if(response.success)
			res.json(response);
		else
			res.status(403).send(response);
	})
});

/* Add new user to database. */
router.post('/sign-up', function(req, res, next) {
	console.log("Password - " + req.body.password);
	console.log("name - " + req.body.first_name);
	console.log("email - " + req.body.email);
	console.log("last_name - " + req.body.last_name);
	console.log("profile - " + req.body.profile);
	console.log("holding - " + req.body.holding);
	
	models.User.addUser(req.body.email, req.body.password, req.body.first_name, req.body.last_name, req.body.profile, req.body.holding, function(response){
		if(response.success)
			res.json(response);
		else
			res.status(403).send(response);
	})
	
	
});

/* Add new user to database. */
router.get('/profiles', function(req, res, next) {
	console.log("Inside Profiles --- ");
	models.Profile.findAll({}).then(function(profiles) {res.json(profiles);});
	
});

/* Add new user to database. */
router.get('/holdings', function(req, res, next) {
	console.log("Inside Holdings --- ");
	models.Holding.findAll({}).then(function(holdings) {res.json(holdings);});
	
});

module.exports = router;
