let fs = require("fs");

const openLive = (socket, linkUser, io, tool) => {
    let isOk = false;
    // let file;
    // let rs;
    socket.on("linkLive", data => {
        linkUser[data.socketId].videoData = [];
        // let i = linkUser.findIndex(e => {
        //     return e.socketId === data.socketId;
        // });
        // linkUser.viedo = []
        // file = fs.createWriteStream(`./static/video/${data.socketId}.mp4`);
    });
    socket.on("getVideo", data => {
        console.log("获取视频", linkUser[data.videoId]);
        if (linkUser[data.videoId].videoData) {
            io.to(data.socketId).emit("sendVideo", {
                video: linkUser[data.videoId].videoData[0],
                time: 0
            });
        }
        // let filterUser = Object.values(linkUser).filter(e => {
        //     return e.type === "type";
        // });
        linkUser[data.socketId].isOk = true;
        console.log(linkUser, 11111111);
        // let list = tool.getUser(linkUser, "看直播", io, socket)
        // list.forEach(e => {
        //     e[data.socketId].isOk = true
        // });
        // linkUser[data.socketId].isLook = true;
    });
    socket.on("liveVideStream", data => {
        // console.log(data.video);
        // file.write(data.video);
        if (linkUser[data.socketId].videoData.length === 0) {
            linkUser[data.socketId].videoData.push(data.video);
            console.log("开启视频", linkUser);
        } else {
            Object.values(linkUser).forEach(e => {
                if (e.isOk) {
                    console.log(e.socketId);
                    io.to(e.socketId).emit("sendVideo", {
                        video: data.video
                        // time: data.time
                    });
                }
            });
        }
    });
    socket.on("overLive", data => {
        console.log("直播结束");
        // file.end();
        delete linkUser[data.socketId].videoData;
        Object.values(linkUser).forEach(e => {
            if (e.isOk) {
                delete e.isOk;
            }
        });
    });
};
module.exports = {
    openLive: openLive
};
