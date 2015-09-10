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
	console.log("---- ");
	
	models.User.validateUser(req.body.email, req.body.password, function(response){
		if(response.success)
			res.json(response);
		else
			res.status(403).send(response);
	})
	//res.status(403).send({status: false});
});

/* Add new user to database. */
router.post('/sign-up', function(req, res, next) {
	models.User.addUser(req.body.email, req.body.password, req.body.first_name, req.body.last_name, req.body.profile, req.body.holding, function(response){
		if(typeof response.success != "undefined" && !response.success)
			res.status(500).send(response);
		else
			res.json(response);
	})
});

/* Add new user to database. */
router.get('/profiles', function(req, res, next) {
	models.Profile.getAllProfiles(function(response){
		if(typeof response.success != "undefined" && !response.success)
			res.status(500).send(response);
		else
			res.json(response);
	});
	
});

/* Add new user to database. */
router.get('/holdings', function(req, res, next) {
	models.Holding.getAllHolding(function(response){
		if(typeof response.success != "undefined" && !response.success)
			res.status(500).send(response);
		else
			res.json(response);
	});
	
});

module.exports = router;
