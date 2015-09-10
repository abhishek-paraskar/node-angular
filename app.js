var express = require('express');
var path = require('path');
var passport = require('passport');
var flash    = require('connect-flash');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var util = require('util');
var url = require('url');
var session      = require('express-session');
var jwt        = require("jsonwebtoken");
var env       = process.env.NODE_ENV || "development";
var config    = require('./config/config.json')[env];
var models = require("./models");

var app = express();



// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'app')));
var home = require('./routes/home');
app.use('/home', home);


app.use(function(req, res, next) {
  // check header or url parameters or post parameters for token
  
  var token = req.headers["authorization"];
  console.log("Checking Autherization");  
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
    
        //return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;  
        next();
      }
    });
    
    //next();
  } else {

    // if there is no token
    // return an error
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
var contacts = require('./routes/contacts');

app.use('/users', users);
app.use('/profile', profile);
app.use('/holding', holding);
app.use('/contacts', contacts);


app.use(function(err, req, res, next){
    res.status(err.status || 500);
    res.send({
        message: err.message,
        error: err
    });
    return;
});

module.exports = app;
