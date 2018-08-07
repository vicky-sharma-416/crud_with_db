// Load modules
var express = require('express');
var router = express.Router();

router.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

// Create new user by registration endpoint
router.use('/user/:id', function(req, res){
	//console.log(JSON.stringify(req))
	controllers (req, res)
})

// Create new user by registration endpoint
router.use('/user', function(req, res){
	//console.log(JSON.stringify(req))
	controllers (req, res)
})

// Response undefined url 
router.use('*', function(req, res){
	res.status(404).send({message: 'Not Found, Invalid URL'});
})

// Handled error and send response
router.use(function(err, req, res, next){
	console.log(' -- err_handled: ' + err);
	res.status(500).send({message: err})
})

// Calling controller according consumed url
function controllers (event, res){
	
	var endPoint = event._parsedUrl.path.split('/')[1];
	console.log(' -- calling_controller: ' + './controllers/' + endPoint + '.js' + ' -- event.method: ' + event.method);	
	
	try{
		var controller = require('./controllers/' + endPoint + '.js');
		var models = require('./models/' + endPoint + '.js');
	}
	catch(err){
		res.status(404).send({message: 'Not Found, please check url'});
	}	
	controller[event.method](event, endPoint, models, res);
}

module.exports = router;

