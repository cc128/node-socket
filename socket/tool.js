const getUser = (linkUser, type, io, socket) => {
    let filterUser = Object.values(linkUser).filter(e => {
        return e.type === type;
    });
    if (type === "视频语音") {
        filterUser.forEach(e => {
            io.to(e.socketId).emit("videoCallUserList", filterUser);
        });
    }
    if (type === "开直播") {
        filterUser.forEach(e => {
            console.log(111)
            io.to(e.socketId).emit("openLiveUserList", filterUser);
        });
    }
    return filterUser;
};
module.exports = {
    getUser: getUser
};
