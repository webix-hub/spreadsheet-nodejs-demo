var mongoUrl = "mongodb://127.0.0.1/spreadsheet-demo";

var mongo   = require('mongodb');
var promise = require('bluebird');
promise.promisifyAll(mongo);

var state = {
	db:null,
	ready:mongo.MongoClient.connectAsync(mongoUrl).then(function(data){
		state.db = data;
	})
};

//connect to DB
module.exports = state;
