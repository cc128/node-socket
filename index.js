const koa = require("koa");
const app = new koa();
const fs = require("fs");

// 聊天消息
const server = require("http").Server(app.callback());
const io = require("socket.io")(server);

let videoData = []; //视频流
let userList = []; //客户端链接id
let anchor = []; //视频主播id

io.on("connection", socket => {
    let v1
    // 发送链接者的id
    socket.emit("socketId", { data: socket.id });
    // 存储视频主播id
    socket.on("anchor", id => {
        anchor[0] = id;
        console.log(anchor[0], "anchor");
        v1 = fs.createWriteStream(`./${anchor[0]}.mp4`)
    });
    // 存储所有连接着id
    userList = Object.keys(socket.adapter.rooms);
    console.log("链接", userList, socket.id);
    // let v1 = fs.createReadStream("./video2.mp4"); //读取流
    // setTimeout(() => {
    //     v1.on("data", chunc => {
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
        console.log("接收视频流", data);
        videoData.push(data);
        // for (let i = 0; i < userList.length; i++) {
        //     if (userList[i] !== anchor[0]) {
        //         if (isOne) {
        //             for (k = 0; k < videoData.length; k++) {
        //                 socket
        //                     .to(userList[i])
        //                     .emit("sendVideo", { data: videoData[k] });
        //             }
        //             console.log(anchor[0], 11111);
        //             isOne = false;
        //         } else {
        //             console.log(isOne, 2222);
        //             socket.to(userList[i]).emit("sendVideo", { data: data });
        //         }
        //     }
        // }
    });
    // 主播断开连接
    socket.on("offLink", data => {
        console.log("主播断开连接", data)
        // v1.end();
    })
    //客户端断开连接
    socket.on("disconnecting", function (socket) {
        console.log("断开", socket);
    });
});
//获取本机ip地址
function getIPAdress() {
    var interfaces = require("os").networkInterfaces();
    console.log(interfaces)
    for (var devName in interfaces) {
        var iface = interfaces[devName];
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
}
server.listen(1337, getIPAdress());
app.listen(8085, getIPAdress());
