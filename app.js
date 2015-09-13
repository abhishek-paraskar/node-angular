var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var jwt        = require("jsonwebtoken");
var env       = process.env.NODE_ENV || "development";
var config    = require('./config/config.json')[env];
var models = require("./models");


var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());



app.use(express.static(path.join(__dirname, 'app')));
var home = require('./routes/home');
app.use('/home', home);




app.use(function(req, res, next) {
  
  // check header parameters for token
  
  var token = req.headers["authorization"];
  
  // decode token
  if (token) {
    var bearer = token.split(" ");
    var bearerToken = bearer[1];
    // verifies secret and checks exp
    jwt.verify(bearerToken, config.authSecret, function(err, decoded) {     
      if (err) {
        return res.status(403).send({ 
          success: false, 
          message: 'Token not valid'
        });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;  
        next();
      }
    });
  } else {
    // if there is no token return an error
    return res.status(403).send({ 
      success: false, 
      message: 'No token provided.'
    });
  }
});

// routes ======================================================================
var users = require('./routes/users');
var profile = require('./routes/profile');
var holding = require('./routes/holding');

app.use('/users', users);
app.use('/profile', profile);
app.use('/holding', holding);



app.use(function(err, req, res, next){
    res.status(err.status || 500);
    res.send({
        message: err.message,
        error: err
    });
    return;
});

module.exports = app;
