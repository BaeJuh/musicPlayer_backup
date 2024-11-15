const updateBookmark = (req, res) => {
    const mysql = require("mysql");
    const dbInfo = require("../../config/dbConfig");
    const { updateBookmark, getMusicAll } = require("./DBquery/DBQueries");

    const db = mysql.createConnection(dbInfo);
    
    db.connect((err) => {
        if (err) { throw err; }
        console.log(req.body);
        const id = req.body.id;
        const bookmark = req.body.bookmark === 1 ? null : 1; 
        db.query(updateBookmark, [bookmark, id], () => {
            db.query(getMusicAll, (err, dbData) => {
                res.json(dbData);
            });
        });
    });
}

module.exports = updateBookmark;