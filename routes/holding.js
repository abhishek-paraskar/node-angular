var express = require('express');
var bodyParser = require('body-parser')
var router = express.Router();
var models = require("../models");

/* Get user list from database database. */
router.get('/holding-list', function(req, res, next) {
	models.Holding.getAllHolding(function(response){
		if(response.success)
			res.json(response);
		else
			res.status(403).send(response);
	});
});

/* Add contact to database. */
router.post('/add-holding', function(req, res, next) {
	models.Holding.addHolding(req.body.name, function(response){
		if(response.success)
			res.json(response);
		else
			res.status(403).send(response);
	});
});

/* Delete user from the db. */
router.get('/delete-holding/:holding_id', function(req, res, next) {

	models.Holding.deleteHolding(req.params.holding_id, function(response){
		if(response.success)
			res.json(response);
		else
			res.status(403).send(response);
	});
});

/* Get the user by id from db. */
router.get('/edit-holding/:holding_id', function(req, res, next) {
	models.Holding.getHoldingById(req.params.holding_id, function(response){
		if(response.success)
			res.json(response);
		else
			res.status(403).send(response);
	});
});

/* Update the user by id in db. */
router.post('/update-holding', function(req, res, next) {
	models.Holding.updateHolding(req.body.id, req.body.name, function(response){
		if(response.success)
			res.json(response);
		else
			res.status(403).send(response);
	});
});
module.exports = router;