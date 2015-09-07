var express = require('express');
var bodyParser = require('body-parser')
var router = express.Router();
var models = require("../models");



/* GET users listing. */
router.get('/contactList', function(req, res, next) {
  	console.log("I recieved the get request");
  	models.Contact.findAll().then(function(contactList) {
    	res.json({
            type: true,
            data: contactList
        });
	});
});

/* GET users listing. */
router.get('/contact-details', function(req, res, next) {
  	console.log("I recieved the get request - " + req.params.contact_id);
  	models.Contact.findOne({
		where: {
			id: req.params.contact_id
		}
	}).then(function(contact) {
		console.log(contact.name);
		res.json(contact);
  	});
});

/* Add contact to database. */
router.post('/add-contact', function(req, res, next) {
	console.log("Name - " + req.body.name);
	console.log("Email - " + req.body.email);
	console.log("Number - " + req.body.number);
	models.Contact.create({
		name: req.body.name,
		email: req.body.email,
		number: req.body.number
	}).then(function() {
    	res.json("{'status':'succcess'}");
  	});
});

/* Delete contact from the db. */
router.get('/delete-contact/:contact_id', function(req, res, next) {
	models.Contact.destroy({
		where: {
			id: req.params.contact_id
		}
	}).then(function() {
		res.json("{'status':'succcess'}");
  	});
});

/* Get the contact by id from db. */
router.get('/edit-contact/:contact_id', function(req, res, next) {
	console.log("Id - " + req.params.contact_id);
	models.Contact.findOne({
		where: {
			id: req.params.contact_id
		}
	}).then(function(contact) {
		console.log(contact.name);
		res.json(contact);
  	});
});

/* Get the contact by id from db. */
router.post('/update-contact', function(req, res, next) {
	models.Contact.update({
		name: req.body.name,
		email: req.body.email,
		number: req.body.number
	},{
		where : {
			id: req.body.id
		}
	}).then(function(contact) {
		res.json(contact);
  	});
});

module.exports = router;
