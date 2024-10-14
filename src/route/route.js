const musicPlayer = require("./service/musicPlayer");

class Route {
    constructor(id) {
        this.id = id;
        this.express = null;
        this.app = null;
    }

    ready() {
        this.express = require("express");
        this.app = this.express();
        this.app.use(this.express.static("public"));

        const {port} = require("../config/routeConfig");
        this.app.listen(port, () => {
            console.log(`http://localhost:${port}`);
        });
    }

    routing() {
        this.app.get("/", (req, res) => {
            const musicPlayer = require("./service/musicPlayer");
            musicPlayer(req, res);
        });

        this.app.post("/musicData", (req, res) => {
            const callDB = require("./component/callDB");
            callDB(req, res);
        });
    }

    controller() {
        this.ready();
        this.routing();
    }
}

module.exports = Route;