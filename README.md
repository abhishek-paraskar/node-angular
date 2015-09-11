# Node-Angular

Start an awesome app with AngularJS on the front, Express + Node on the back. This project is an application skeleton for a typical AngularJS web app for those who want to use Node to serve their apis.

It contains a bunch of scripts all preconfigured for instant web development gratification. Just clone the repo (or download the zip/tarball) and you're ready to browse the application.


Node-Angular app shows how to wire together Angular client-side components with Express on the server.
The express communcates with the MySQL database using Sequelize ORM.

It also implements the token based authentication and authorization mechanism.


#Prerequisites -

Node JS
MySql

## How to use Node-Angular

Clone the node-angular repository, run `npm install` to grab the dependencies, and start hacking!
Go to the project directory
Run command npm install (It will install all nodejs dependecies and bower dependencies)
Set up the MySql configuarion in /config/config.js file.


### Running the app
     
     'npm start'

## Directory Layout
    
    app.js              	--> app config
    package.json        	--> for npm
    bower.json         	 	--> for bower
    .bowerrc            	--> for bower
    routes/
      holding.js        	--> route for serving secured Holding JSON
      home.js               --> route for serving non secured api's such as authenticate, login, etc..
      profile.js            --> route for serving secured api's related to profile JSON
      routes.js            	--> contains nothing
   	  user.js            	--> route for serving secured api's related to user JSON
   	models/
      holding.js        	--> A model object for serving Holding related data
      index.js              --> The basic configations for Sequelize
      profile.js            --> A model object for serving Profile related data
   	  user.js            	--> A model object for serving User related data
   	config/
      config.js        		--> A configuartion file for database connection and secret key required for jsonwebtoken
    bin/
      www        			--> Some basic configurations related to sequleize and error handling
    app/            		--> all of the files to be used in on the client side
      css/              	--> css files
        style.css         	--> default stylesheet
      img/              	--> image files
      js/               	--> javascript files
        app.js          	--> declare top-level app module
        controllers.js  	--> application controllers
        services.js     	--> custom angular services
      partials/*			--> angular view partials
      index.html            --> Angularjs Startup file.



### Running tests

Coming soon!


## Contact
I am quite a new bie to angularjs and nodejs. This is my first startup. 
Please help me in improving the demo, it will be helpful for others as well.
Suggestions are most welcome.
You can reach me at abhishek.paraskar@gmail.com

