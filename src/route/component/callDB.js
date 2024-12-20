const callDB = (req, res) => {
    const mysql = require("mysql");
    const dbInfo = require("../../config/dbConfig");
    const { getMusicAll } = require("./DBquery/DBQueries");

    const db = mysql.createConnection(dbInfo);
    db.connect((err) => {
        if (err) { throw err; }
        db.query(getMusicAll, (err, dbData) => {
            res.json(dbData);
        });
    });
}

module.exports = callDB;