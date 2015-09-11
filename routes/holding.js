var express = require('express');
var bodyParser = require('body-parser')
var router = express.Router();
var models = require("../models");

/* Get holding list from database. */
router.get('/holding-list', function(req, res, next) {
	models.Holding.getAllHolding(function(response){
		if(typeof response.success != "undefined" && !response.success)
			res.status(500).send(response);
		else
			res.json(response);
	});
});

/* Add holding to database. */
router.post('/add-holding', function(req, res, next) {
	models.Holding.addHolding(req.body.name, function(response){
		if(typeof response.success != "undefined" && !response.success)
			res.status(500).send(response);
		else
			res.json(response);
	});
});

/* Delete holding from the db. */
router.get('/delete-holding/:holding_id', function(req, res, next) {

	models.Holding.deleteHolding(req.params.holding_id, function(response){
		if(typeof response.success != "undefined" && !response.success)
			res.status(500).send(response);
		else
			res.json(response);;
	});
});

/* Get the user by id from db. */
router.get('/edit-holding/:holding_id', function(req, res, next) {
	models.Holding.getHoldingById(req.params.holding_id, function(response){
		if(typeof response.success != "undefined" && !response.success)
			res.status(500).send(response);
		else
			res.json(response);
	});
});

/* Update the user by id in db. */
router.post('/update-holding', function(req, res, next) {
	models.Holding.updateHolding(req.body.id, req.body.name, function(response){
		if(typeof response.success != "undefined" && !response.success)
			res.status(500).send(response);
		else
			res.json(response);
	});
});
module.exports = router;