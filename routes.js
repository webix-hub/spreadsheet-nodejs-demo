module.exports = function(app){
	require("./images")(app);
	require("./spreadsheets")(app);
	require("./pages")(app);
}