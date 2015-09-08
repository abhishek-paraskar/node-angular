var express = require('express');
var bodyParser = require('body-parser')
var router = express.Router();
var models = require("../models");

/* Get user list from database database. */
router.get('/user-list', function(req, res, next) {
	models.User.getAllUsers(function(response){
		if(response.success)
			res.json(response);
		else
			res.status(403).send(response);
	});
});

/* Add contact to database. */
router.post('/add-user', function(req, res, next) {
	models.User.addUser(req.body.email, req.body.password, req.body.name, req.body.last_name, req.body.profile, req.body.holding, function(response){
		if(response.success)
			res.json(response);
		else
			res.status(403).send(response);
	});
});

/* Delete user from the db. */
router.get('/delete-user/:user_id', function(req, res, next) {

	models.User.deleteUser(req.params.user_id, function(response){
		if(response.success)
			res.json(response);
		else
			res.status(403).send(response);
	});
});

/* Get the user by id from db. */
router.get('/edit-user/:user_id', function(req, res, next) {
	models.User.getUserById(req.params.user_id, function(response){
		if(response.success)
			res.json(response);
		else
			res.status(403).send(response);
	});
});

/* Update the user by id in db. */
router.post('/update-user', function(req, res, next) {
	models.User.updateUser(req.body.id, req.body.email, req.body.password, req.body.name, req.body.last_name, req.body.profile, req.body.holding, function(response){
		if(response.success)
			res.json(response);
		else
			res.status(403).send(response);
	});
});
module.exports = router;