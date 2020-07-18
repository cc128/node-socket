const openLive = (socket, list) => {
    socket.on("liveVideStream", data => {
        let i = list.findIndex(e => {
            return e.socketId === data.socketId;
        });
        // if (list[i].videoData.length === 0) {
        list[i].videoData.push(data.video);
        // }
        console.log(list, 3333);
    });
};
module.exports = {
    openLive: openLive
};
