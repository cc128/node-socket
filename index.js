const koa = require("koa");
const app = new koa();

const server = require("http").Server(app.callback());
const socket = require("./socket/index")
socket.socket(server)

server.listen(7005);
