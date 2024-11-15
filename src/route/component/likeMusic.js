const likeMusic = (req, res) => {
    const mysql = require("mysql");
    const dbInfo = require("../../config/dbConfig");
    const { getLikeMusic } = require("./DBquery/DBQueries");

    const db = mysql.createConnection(dbInfo);
    db.connect((err) => {
        if (err) { throw err; }
        db.query(getLikeMusic, (err, dbData) => {
            // console.log(dbData);
            res.json(dbData);
        });
    });
}

module.exports = likeMusic;