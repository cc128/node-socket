const koa = require("koa");
const app = new koa();
const fs = require("fs");

// 聊天消息
const server = require("http").Server(app.callback());
const io = require("socket.io")(server);

let videoData = []; //视频流
let anchor = []; //视频主播id
let userMsg = {}; //链接用户
let ZBuser = {}; //主播用户
let time = null;
io.on("connection", socket => {
    socket.emit("socketId", socket.id);
    socket.on("userLink", data => {
        // if (data) {
        //     socket.join(data);
        // }
        console.log("链接")
        if (data.isZB) {
            ZBuser[data.socketId] = {
                name: data.name,
                id: data.socketId
            };
            ZBuser[data.socketId].videoData = []
        } else {
            userMsg[data.socketId] = {
                name: data.name,
                id: data.socketId
            };
            // if (Object.values(ZBuser)[0].videoData && Object.values(ZBuser)[0].videoData.length) {
            //     console.log("发送")
            //     Object.values(ZBuser)[0].videoData.forEach(e => {
            //         socket.emit("videoData", {
            //             video: e,
            //             time: time || 0
            //         });
            //     })
            // }
        }
        io.emit("userList", filterUser(socket, userMsg));
    }); //链接用户
    socket.on("videoStreaming", data => {
        // time = data.time;
        // ZBuser[data.socketId].videoData.push(data.video);
        // Object.keys(userMsg).forEach(e => {
        //     socket.to(e).emit("videoData", {
        //         video: data.video,
        //         time: time || 0
        //     });
        // })
        // 发送视频流给被呼叫人
        console.log(`接收并发送视频流给${data.receiveUserId}`);
        socket.to(data.receiveUserId).emit("videoMsg", { video: data.video });
    });// 接收客户端发来的视频消息




    socket.on("sendCall", data => {
        socket.to(data.called).emit("showCall", { ...data, name: userMsg[data.called].name });// 给被呼叫人发消息
    }); // 启动呼叫
    socket.on("overCall", data => {
        socket.emit("secretMsg", { isConsent: false });
        if (data.state === 1) {
            // 呼叫方挂断
            socket.to(data.called).emit("secretMsg", { isConsent: false });
        } else if (data.state === 2) {
            // 被呼叫方挂断
            socket.to(data.callId).emit("secretMsg", { isConsent: false });
        }
    }); // 挂断呼叫
    socket.on("tokeCall", data => {
        console.log(`接受${data.callId}呼叫`);
        socket.emit("secretMsg", { isConsent: true, sendVideoId: data.callId });
        console.log(userMsg[data.called].name)
        socket.to(data.callId).emit("secretMsg", {
            isConsent: true,
            sendVideoId: data.called,
        });
    }); //接受呼叫



    //客户端断开连接
    socket.on("disconnect", err => {

        io.emit("userList", filterUser(socket, userMsg));
        // console.log("用户已断开");
    });
});
const filterUser = (socket, userMsg) => {
    Object.keys(userMsg).forEach((e, i) => {
        if (!getLinkUser(socket).includes(e)) {
            delete userMsg[Object.keys(userMsg)[i]]
        }
    })
    Object.keys(ZBuser).forEach((e, i) => {
        if (!getLinkUser(socket).includes(e)) {
            delete ZBuser[Object.keys(ZBuser)[i]]
        }
    })
    return Object.values(userMsg)
};
//获取链接用户
const getLinkUser = socket => {
    return Object.keys(socket.adapter.rooms);
};
//获取本机ip地址
function getIPAdress() {
    var interfaces = require("os").networkInterfaces();
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
server.listen(7005, getIPAdress());
// app.listen(8085, "192.168.0.184");
