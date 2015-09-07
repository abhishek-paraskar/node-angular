var express = require('express');
var bodyParser = require('body-parser')
var router = express.Router();
var models = require("../models");


router.get('/user-list', function(req, res, next) {
  	console.log("I recieved the get request");
  	models.User.findAll().then(function(userList) {
    	res.json(userList);
	});
});




/* Add contact to database. */
router.post('/add-user', function(req, res, next) {
	console.log("Name - " + req.body.name);
	console.log("Email - " + req.body.email);
	console.log("Last Name - " + req.body.last_name);
	console.log("Password - " + req.body.password);
	console.log("Profile - " + req.body.profile);
	console.log("Holding - " + req.body.holding);
	models.User.create({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
		last_name: req.body.last_name,
		profile: req.body.profile,
		holding: req.body.holding
	}).then(function() {
    	res.json("{'status':'succcess'}");
  	});
});

/* Delete contact from the db. */
router.get('/delete-user/:user_id', function(req, res, next) {
	models.User.destroy({
		where: {
			id: req.params.user_id
		}
	}).then(function() {
		res.json("{'status':'succcess'}");
  	});
});

/* Get the contact by id from db. */
router.get('/edit-user/:user_id', function(req, res, next) {
	console.log("Id - " + req.params.user_id);
	models.User.findOne({
		where: {
			id: req.params.user_id
		}
	}).then(function(user) {
		console.log(user.name);
		res.json(user);
  	});
});

/* Get the contact by id from db. */
router.post('/update-user', function(req, res, next) {
	models.User.update({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
		last_name: req.body.last_name,
		profile: req.body.profile,
		holding: req.body.holding
	},{
		where : {
			id: req.body.id
		}
	}).then(function(user) {
		res.json(user);
  	});
});



module.exports = router;