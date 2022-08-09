const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();
// const https = require("https");
// const path = require("path");
// const fs = require("fs");

global.__basedir = __dirname;

const routes = require("./src/routes");

const port = process.env.APP_PORT || 3011;
const host = "0.0.0.0";

app.use(cors());

app.use(
    express.json({
        limit: "50mb",
    }),
    express.urlencoded({
        limit: "50mb",
        parameterLimit: 100000,
        extended: false,
    })
);

app.use("/", express.static(__dirname + "/dist"));

app.use(cookieParser());

app.use("/api", routes);

// const options = {
//   key: fs.readFileSync(path.resolve(__dirname, "server.key")),
//   cert: fs.readFileSync(path.resolve(__dirname, "server.crt")),
//   passphrase: "pp123456",
// };

// const server = https.createServer(options, app);

app.listen(port, host, () =>
    console.log(`Server is listening at port ${port}`)
);