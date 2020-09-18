const koa = require("koa");
const path = require("path");
const fs = require("fs");
const http = require("http");
const https = require("https");
const static = require("koa-static");
const app = new koa();
const options = {
    key: fs.readFileSync(
        path.join(__dirname, "./certificate/lcc.key")
    ),
    cert: fs.readFileSync(
        path.join(__dirname, "./certificate/lcc.pem")
    )
};
const httpsServer = https.createServer(options, app.callback());
httpsServer.listen(7004);

const httpServer = http.Server(app.callback());
httpServer.listen(7005);

const socket = require("./socket/index");
socket.socket(httpsServer);

// app.use(static(__dirname + "/static"));
app.use(static(__dirname));
// app.listen(3000);
