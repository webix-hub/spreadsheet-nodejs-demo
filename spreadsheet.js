var mongo = require("./db");
var promise = require("bluebird");

var data = mongo.db.collection("data");
var styles = mongo.db.collection("styles");
var sizes = mongo.db.collection("sizes");
var spans = mongo.db.collection("spans");


module.exports = function(req, res, next){
	var id = req.params.id;
	var action = req.params.action;
	if (!id || !action) return next();

	if (action == "get")
		echo(res, get_all(id));
	else {
		//data saving
		var obj = req.body;

		//store sheet id in the data object
		obj.sheet = id;

		//we can have 4 different types of request
		if (action == "data")
			echo(res, save_data(req.body));
		else if (action == "styles")
			echo(res, save_styles(req.body));
		else if (action == "spans")
			echo(res, save_spans(req.body));
		else if (action == "sizes")
			echo(res, save_sizes(req.body));
	}
};

function get_all(id){
	//get data, styles, spans and sizes
	return promise.all([
		get_data(id),
		get_styles(id),
		get_spans(id),
		get_sizes(id)
	]).then(function(res){
			return {
				data:   res[0],
				styles: res[1],
 				spans:  res[2],
				sizes:  res[3]
			}
		});
};

//read from db and convert to a plain array
function get_data(id){
	return data.findAsync({ sheet: id })
	.then(function(cursor){
		return cursor.toArrayAsync();
	})
	.then(function(set){
		var plaindata = [];
		for (var i = 0; i < set.length; i++){
			var obj = set[i];
			plaindata.push([obj.row, obj.column, obj.value, obj.style]);
		}

		return plaindata;
	});
}

//read from db and convert to a plain array
function get_styles(id){
	return styles.findAsync({ sheet: id })
	.then(function(cursor){
		return cursor.toArrayAsync();
	})
	.then(function(set){
		var plaindata = [];
		for (var i = 0; i < set.length; i++){
			var obj = set[i];
			plaindata.push([obj.name, obj.text]);
		}

		return plaindata;
	});
}

//read from db and convert to a plain array
function get_sizes(id){
	return sizes.findAsync({ sheet: id })
	.then(function(cursor){
		return cursor.toArrayAsync();
	})
	.then(function(set){
		var plaindata = [];
		for (var i = 0; i < set.length; i++){
			var obj = set[i];
			plaindata.push([obj.row, obj.column, obj.size ]);
		}

		return plaindata;
	});
}

//read from db and convert to a plain array
function get_spans(id){
	return spans.findAsync({ sheet: id })
	.then(function(cursor){
		return cursor.toArrayAsync();
	})
	.then(function(set){
		var plaindata = [];
		for (var i = 0; i < set.length; i++){
			var obj = set[i];
			plaindata.push([obj.row, obj.column, obj.x, obj.y ]);
		}

		return plaindata;
	});
}

//save data back to DB
function save_data(obj){
	return data.updateAsync({
		row:obj.row, column:obj.column, sheet:obj.sheet
	}, obj, {
		upsert:true
	}).then(function(){
		return { status: "ok" };
	});
}

//save styles back to DB
function save_styles(obj){
	return styles.updateAsync({
		name: obj.name, sheet:obj.sheet
	}, obj, {
		upsert:true
	}).then(function(){
		return { status: "ok" };
	});
}

//save sizes back to DB
function save_sizes(obj){
	return sizes.updateAsync({
		row:obj.row, column:obj.column, sheet:obj.sheet
	}, obj, {
		upsert:true
	}).then(function(){
		return { status: "ok" };
	});
}

//save spans back to DB
function save_spans(obj){
	return spans.updateAsync({
		row:obj.row, column:obj.column, sheet:obj.sheet
	}, obj, {
		upsert:true
	}).then(function(){
		return { status: "ok" };
	});
}

//output json data back to client
function echo(res, data){
	data.then(function(obj){
		res.write(JSON.stringify(obj));
		res.end();
	});
}