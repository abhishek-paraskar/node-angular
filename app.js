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

  // decode token
  if (token) {
    /*
    // verifies secret and checks exp
    jwt.verify(token, config.secret, function(err, decoded) {     
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;  
        next();
      }
    });
    */
    next();
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
var contacts = require('./routes/contacts');

app.use('/users', users);
app.use('/contacts', contacts);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  console.log(err);
  if(url.parse(req.url).pathname == '/') {
      res.writeHead(200, {'content-type': 'text/html'});
      var rs = fs.createReadStream('index.html');
      util.pump(rs, res);
  } else {
      res.writeHead(404, {'content-type': 'text/html'});
      var rs = fs.createReadStream('404.html');
      util.pump(rs, res);
  }
});


module.exports = app;
