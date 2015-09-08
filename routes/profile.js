var express = require('express');
var bodyParser = require('body-parser')
var router = express.Router();
var models = require("../models");

/* Get user list from database database. */
router.get('/profile-list', function(req, res, next) {
	models.Profile.getAllProfiles(function(response){
		if(response.success)
			res.json(response);
		else
			res.status(403).send(response);
	});
});

/* Add contact to database. */
router.post('/add-profile', function(req, res, next) {
	models.Profile.addProfile(req.body.name, function(response){
		if(response.success)
			res.json(response);
		else
			res.status(403).send(response);
	});
});

/* Delete user from the db. */
router.get('/delete-profile/:profile_id', function(req, res, next) {

	models.Profile.deleteProfile(req.params.profile_id, function(response){
		if(response.success)
			res.json(response);
		else
			res.status(403).send(response);
	});
});

/* Get the user by id from db. */
router.get('/edit-profile/:profile_id', function(req, res, next) {
	models.Profile.getProfileById(req.params.profile_id, function(response){
		if(response.success)
			res.json(response);
		else
			res.status(403).send(response);
	});
});

/* Update the user by id in db. */
router.post('/update-profile', function(req, res, next) {
	models.Profile.updateProfile(req.body.id, req.body.name, function(response){
		if(response.success)
			res.json(response);
		else
			res.status(403).send(response);
	});
});
module.exports = router;