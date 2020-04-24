const koa = require("koa");
const app = new koa();
const fs = require("fs");

// 聊天消息
const server = require("http").Server(app.callback());
const io = require("socket.io")(server);

let videoData = []; //视频流
let anchor = []; //视频主播id

io.on("connection", socket => {
    socket.on("userLink", data => {
        socket.join(data);
        console.log(`${socket.id}已链接`, `共有${getLinkUser(socket)}`);
        io.emit("userList", getLinkUser(socket));
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
    // 监听客户端发来的消息
    socket.on("videoStreaming", data => {
        // if (videoData.length === 0) {
        //     videoData.push(data);
        // }
        // videoData[1] = data;
        v1.write(data);
        // console.log("接收视频流", data);
        videoData.push(data);
    });
    // 主播断开连接
    socket.on("offLink", data => {
        socket.leave(data);
        io.emit("userList", getLinkUser(socket));
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
server.listen(1337, "192.168.0.184");
app.listen(8085, "192.168.0.184");
