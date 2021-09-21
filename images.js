const fs = require("fs");
const path = require("path");
const Busboy = require('busboy');

module.exports = function(app){
    // show all attachments
    app.get("/images/:id",(req, res, next) => {
        res.sendFile(__dirname + "/images/"+req.params.id);
    });

    // upload new file
    app.post("/images",(req, res, next) => {
        var busboy = new Busboy({ headers: req.headers });
        var saveTo = "";
        busboy.on("file", (field, file, name) => {
            saveTo = path.join(__dirname, "images", path.basename(name));
            file.pipe(fs.createWriteStream(saveTo));
        });
        busboy.on("finish", function() {
            if (saveTo){
                res.send({
                    imageURL: "/images/" + path.basename(saveTo),
                    status: "server"
                });
            }
        });

        return req.pipe(busboy);
    });
}