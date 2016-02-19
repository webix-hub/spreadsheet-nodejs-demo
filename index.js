var express = require('express');
var parser = require('body-parser');
var mongo = require('./db.js');

mongo.ready.then(function(){

	var app = express();

	app.use(parser.urlencoded({ extended: false }));
	app.use(express.static(__dirname + '/public'));

	app.get( '/sheet/:id/:action', require("./spreadsheet"));
	app.post('/sheet/:id/:action', require("./spreadsheet"));
	
	var server = app.listen(3000, function () {
		var host = server.address().address;
		var port = server.address().port;

		console.log('App listening at http://%s:%s', host, port);
	});

});