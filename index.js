var express = require("express");
var bodyParser = require("body-parser");

var app = express();

// parsing application/json
app.use(bodyParser.json()); 
// parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true })); 

require("./routes")(app);

// load other assets
app.use(express.static("./"));

const port = "3000";
const host = "localhost";
var server = app.listen(port, host, function () {
    console.log("Server is running on port " + port + "...");
    console.log(`Open http://${host}:${port}/public in browser`)
});