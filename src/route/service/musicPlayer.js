const musicPlayer = (req, res) => {
    const fs = require("fs");
    fs.readFile("./view/index.html", "utf-8", (err, fileData) => {
        res.send(fileData);
    });
}

module.exports = musicPlayer;