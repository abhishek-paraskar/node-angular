var express = require('express');
var bodyParser = require('body-parser')
var router = express.Router();
var models = require("../models");

/* Get profile list from database database. */
router.get('/profile-list', function(req, res, next) {
	models.Profile.getAllProfiles(function(response){
		if(typeof response.success != "undefined" && !response.success)
			res.status(500).send(response);
		else
			res.json(response);
	});
});

/* Add profile to database. */
router.post('/add-profile', function(req, res, next) {
	models.Profile.addProfile(req.body.name, function(response){
		if(typeof response.success != "undefined" && !response.success)
			res.status(500).send(response);
		else
			res.json(response);
	});
});

/* Delete profile from the db. */
router.get('/delete-profile/:profile_id', function(req, res, next) {

	models.Profile.deleteProfile(req.params.profile_id, function(response){
		if(typeof response.success != "undefined" && !response.success)
			res.status(500).send(response);
		else
			res.json(response);
	});
});

/* Get the profile by id from db. */
router.get('/edit-profile/:profile_id', function(req, res, next) {
	models.Profile.getProfileById(req.params.profile_id, function(response){
		if(typeof response.success != "undefined" && !response.success)
			res.status(500).send(response);
		else
			res.json(response);
	});
});

/* Update the profile by id in db. */
router.post('/update-profile', function(req, res, next) {
	models.Profile.updateProfile(req.body.id, req.body.name, function(response){
		if(typeof response.success != "undefined" && !response.success)
			res.status(500).send(response);
		else
			res.json(response);
	});
});
module.exports = router;