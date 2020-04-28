const koa = require("koa");
const app = new koa();
const fs = require("fs");

// 聊天消息
const server = require("http").Server(app.callback());
const io = require("socket.io")(server);

let videoData = []; //视频流
let anchor = []; //视频主播id

io.on("connection", socket => {
    socket.emit("socketId", socket.id);
    console.log(`${socket.id}已链接`, `共有${getLinkUser(socket)}`);
    //链接用户
    socket.on("userLink", data => {
        if (data) {
            socket.join(data);
        }
        console.log(`${socket.id}已链接`, `共有${getLinkUser(socket)}`);
        io.emit("userList", getLinkUser(socket));
    });
    // 启动呼叫
    socket.on("sendCall", data => {
        // 给被呼叫人发消息
        socket.to(data.called).emit("showCall", { ...data });
        // console.log(`被呼叫用户${data.called},呼叫用户${data.callId}`);
    });
    // 主动挂断呼叫
    socket.on("initiativeOverCall", data => {
        socket.emit("secretMsg", { isConsent: false });
    });
    // 挂断呼叫
    socket.on("overCall", data => {
        socket.emit("secretMsg", { isConsent: false });
        if (data.state === 1) {
            // 呼叫方挂断
            socket.to(data.called).emit("secretMsg", { isConsent: false });
        } else if (data.state === 2) {
            // 被呼叫方挂断
            socket.to(data.callId).emit("secretMsg", { isConsent: false });
        }
    });
    //接受呼叫
    socket.on("tokeCall", data => {
        console.log(`接受${data.callId}呼叫`);
        socket.emit("secretMsg", { isConsent: true, sendVideoId: data.callId });
        socket.to(data.callId).emit("secretMsg", {
            isConsent: true,
            sendVideoId: data.called
        });
    });
    // 接收客户端发来的视频消息
    socket.on("videoStreaming", data => {
        // 发送视频流给被呼叫人
        console.log(`接收并发送视频流给${data.receiveUserId}`);
        socket.to(data.receiveUserId).emit("videoMsg", { video: data.video });
    });
    let v1;
    // 存储视频主播id
    socket.on("anchor", id => {
        anchor[0] = id;
        // console.log(anchor[0], "anchor");
        v1 = fs.createWriteStream(`./viedo2.mp4`);
    });
    // let v2 = fs.createReadStream("./zxy.mov"); //读取流
    // setTimeout(() => {
    //     v2.on("data", chunc => {
    //         console.log(chunc);
    //         socket.emit("sendVideo", { data: chunc });
    //     });
    // }, 1000);

    let isOne = true;

    // 主播断开连接
    socket.on("offLink", data => {
        // socket.leave(data);
        // io.emit("userList", getLinkUser(socket));
        console.log(`${data}离开了`, `还剩下${getLinkUser(socket)}`);
        // v1.end();
    });
    //客户端断开连接
    socket.on("disconnect", socket => {
        console.log("用户已断开", socket);
    });
});
//获取链接用户
const getLinkUser = socket => {
    return Object.keys(socket.adapter.rooms);
};
//获取本机ip地址
function getIPAdress() {
    var interfaces = require("os").networkInterfaces();
    // console.log(interfaces)
    for (var devName in interfaces) {
        var iface = interfaces[devName];
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (
                alias.family === "IPv4" &&
                alias.address !== "127.0.0.1" &&
                !alias.internal
            ) {
                return alias.address;
            }
        }
    }
}
server.listen(7005, "0.0.0.0");
// app.listen(8085, "192.168.0.184");
