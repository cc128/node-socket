let fs = require("fs");

const openLive = (socket, list) => {
    let file;
    socket.on("linkLive", data => {
        file = fs.createWriteStream(`./liveVideo/${data.socketId}.mp4`);
    });
    socket.on("liveVideStream", data => {
        console.log(data.video)
        file.write(data.video);
        // let i = list.findIndex(e => {
        //     return e.socketId === data.socketId;
        // });
        // // if (list[i].videoData.length === 0) {
        // list[i].videoData.push(data.video);
        // // }
        // console.log(list, 3333);
    });
    socket.on("overLive", data => {
        console.log("直播结束")
        file.end();
    });
};
module.exports = {
    openLive: openLive
};
