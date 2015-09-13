"use strict";
var nodemailer = require('nodemailer');
var config    = require('../config/config.json')[env];
var env       = process.env.NODE_ENV || "development";

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'abhishek.paraskar@gmail.com',
        pass: 'Abhi1990'
    }
});

module.exports = {
  sendMail : function (email, activationLink, callback) {
  	console.log("Email - " + email)
  	console.log("activationLink - " + activationLink)
  		var mailOptions = {
		    from: 'abhishek.paraskar@gmail.com', // sender address 
		    to: email, // list of receivers 
		    subject: 'Welcome to node js and angular js example', // Subject line 
		    text: 'Hello world ✔', // plaintext body 
		    html: '<a href="http://localhost:3000/#/activate/' + activationLink + '">Click here to confirm your mail address</a>' // html body 
		};
		console.log("Sending mail...")
		// send mail with defined transport object 
		transporter.sendMail(mailOptions, function(error, info){
		    if(error){
		    	console.log("Error while sending mail --" + error);
		        callback({success:false, message: error});
		    }
		    console.log('Message sent: ' + info.response);
		    callback({success:true, message: 'Mail sent successfully'});
		}); 
  }
};