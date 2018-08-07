// Load modules
var pg = require('pg');
var conString = "postgres://postgres:cdn123@localhost:5432/local";
var client = new pg.Client(conString);
client.connect();
	
module.exports = {
	
	POST: function(req, endPoint, models, res){

		var body = req.body;
			
		console.log(' -- body ' + JSON.stringify(body));
			
		var models = require('../models/' + endPoint + '.js');
		var query = "INSERT INTO public." + endPoint + " ("; 
		var values = 'VALUES(';

		Object.keys(models).map(function(key, index){
			if(body.hasOwnProperty(key)){
				query += key + ', ';
				values += '$' + index + ', ';
			}
		})
		
		if(!values.includes('$')){
			res.status(500).send({message: 'Please provide right data'});
			return 1;
		}
	
		query = query.slice(0,-2) + ') ' + values.slice(0,-2) + ') RETURNING *';
		
		console.log(' -- query ' + query);
		
		tableCreated(endPoint)
			.then(result => {
				return client.query(query, Object.values(body))
			})
			.then(result => {
				console.log(' -- user ' + JSON.stringify(result.rows));
				res.status(201).send({users: result.rows});
			})
			.catch(error => {		
				console.log(' -- crud_error ' + error.message);
				res.status(500).send({message: error.message});
			})
		
	},
	
	GET: function(req, endPoint, models, res){

		console.log(' -- requested_query ' + JSON.stringify(req.query));

		var query = "SELECT * FROM public." + endPoint;		
		
		console.log(' -- req.params ' + JSON.stringify(req.params));
			
		if(req.params && req.params.id){
			query += " WHERE id=" + req.params.id;			
		}
		else if(Object.getOwnPropertyNames(req.query).length > 0){
			query += " WHERE ";
			Object.keys(req.query).map(function(key){
				query += key + "='" + req.query[key] + "' AND ";
			})
			query = query.slice(0,-5);
		}

		console.log(' -- query ' + query);
		
		tableCreated(endPoint)
			.then(result => {
				return client.query(query)
			})
			.then(result => {		
				console.log(' -- result ' + JSON.stringify(result.rows));
				if(result.rows.length > 0){
					//res.status(200).send({users: result.rows});
					res.status(200).send(result.rows);
				}
				else{
					res.status(404).send({users: result.rows});
				}
			})
			.catch(error => {		
				console.log(' -- crud_error ' + error.message);
				res.status(500).send({message: error.message});
			})
		
	},
	
	PUT: function(req, endPoint, models, res){
		
		var body = req.body;
			
		// Make sure email/id not updating, it's unique/PK key
		if(Object.getOwnPropertyNames(req.params).length == 0){
			res.status(405).send({message: "Method not allowed."});
		}
		else if(body && (body.email || body.id)){
			res.status(400).send({message: "Can't update " + (body.email ? 'email' : 'id') + "."});
		}
		else{
			console.log(' -- requested_query ' + JSON.stringify(req.query));

			var query = "UPDATE public." + endPoint + " SET ";
			
			Object.keys(body).map(function(key){
				query += key + "='" + body[key] + "', ";
			})

			query = query.slice(0,-2) + " WHERE id=" + req.params.id + " RETURNING *";
			
			console.log(' -- query ' + query);
			
			client
				.query(query)
				.then(result => {		
					console.log(' -- result ' + JSON.stringify(result.rows));
					if(result.rows.length > 0){
						res.status(200).send({user: result.rows[0]});
					}
					else{
						res.status(404).send({message: 'Not Found'});
					}
				})
				.catch(error => {		
					console.log(' -- crud_error ' + error.message);
					res.status(500).send({message: error.message});
				})
		}
	},
	
	DELETE: function(req, endPoint, models, res){

		console.log('--------------------------');
		console.log('req.params: ' + JSON.stringify(req.params));
		
		if(Object.getOwnPropertyNames(req.params).length == 0){
			res.status(403).send({message: 'Forbidden.'});
		}
		else{
			
			var query = "DELETE FROM public." + endPoint + " WHERE id=" + req.params.id + ' RETURNING *';
			
			console.log(' -- query ' + query);
			
			client
				.query(query)
				.then(result => {		
					console.log(' -- result ' + JSON.stringify(result.rows));
					if(result.rows.length > 0){
						res.status(204).send({message: 'Deleted successfully'});
					}
					else{
						res.status(404).send({message: 'Not Found'});
					}
				})
				.catch(error => {		
					console.log(' -- crud_error ' + error.message);
					res.status(500).send({message: error.message});
				})
		}
	}	
}

function tableCreated(endpoint){

	var models = require('../models/' + endpoint + '.js');
	var createTable = "CREATE TABLE IF NOT EXISTS public." + endpoint + " (";
	
	for(var key in models) {
	
		//console.log(key + ' : ' + models[key]);
		createTable += key + ' ' + models[key].type;
		
		if(key == 'id'){
			createTable += ' PRIMARY KEY';
		}
		
		createTable += ', '
	}

	createTable = createTable.slice(0,-2) + ')'

	console.log(' -- createTable: ' + createTable);
	
	return client.query(createTable);
}



