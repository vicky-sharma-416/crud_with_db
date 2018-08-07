// Load module
var express = require('express'); 
var bodyParser = require('body-parser'); 
var app = express(); 
var router = require('./router.js'); 

// App to use bodyParser() 
app.use(bodyParser.urlencoded({extended: false})); 

// Get the data from a POST 
app.use(bodyParser.json());

// Route url to router 
app.use('/', router); 

// Create server 
var server = app.listen(8081, function () { 
	var host = server.address().address; 
	var port = server.address().port;
	console.log("Example app listening at http://localhost:" + port); 
})
