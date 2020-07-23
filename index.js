const koa = require("koa");
const http = require("http");
// const static = require("koa-static");
const app = new koa();

// app.use(static(__dirname + "/static/video"));
// app.use(static(__dirname));
// app.listen(3000);

const server = http.Server(app.callback());
const socket = require("./socket/index");
socket.socket(server);

server.listen(7005);
