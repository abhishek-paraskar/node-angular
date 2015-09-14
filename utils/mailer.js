"use strict";

var nodemailer = require('nodemailer');
var env       = process.env.NODE_ENV || "development";
var smtp    = require('../config/smtp.json')[env];


var transporter = nodemailer.createTransport({
    service: smtp.service,
    auth: {
        user: smtp.username,
        pass: smtp.password
    }
});

module.exports = {
  sendMail : function (email, activationLink, callback) {
  		var mailOptions = {
		    from: smtp.defaultSender, // sender address 
		    to: email, // list of receivers 
		    subject: 'Welcome to node js and angular js example', // Subject line 
		    html: '<a href="' + smtp.defaultServer +'#/activate/' + activationLink + '">Click here to confirm your mail address</a>' // html body 
		};
		// send mail with defined transport object 
		transporter.sendMail(mailOptions, function(error, info){
		    if(error){
		        callback({success:false, message: error});
		    }
		    callback({success:true, message: 'Mail sent successfully'});
		}); 
  }
};