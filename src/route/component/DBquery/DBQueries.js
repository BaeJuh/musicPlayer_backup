module.exports = {
    getMusicAll: "SELECT * FROM musiclist;",
    updateBookmark: "UPDATE musiclist SET bookmark = ? WHERE id=?;",
    getLikeMusic: "SELECT * FROM musiclist WHERE bookmark=1;"
}