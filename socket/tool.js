const getUser = (linkUser, type, io, socket) => {
    let filterUser = Object.values(linkUser).filter(e => {
        return e.type === type;
    });
    if (type === "视频语音") {
        filterUser.forEach(e => {
            io.to(e.socketId).emit("videoCallUserList", filterUser);
        });
    }
    return filterUser;
};
const sendUserList = (lookLiveUser, anchorList, io, socket) => {
    lookLiveUser.forEach(e => {
        io.to(e.socketId).emit("openLiveUserList", anchorList);
    });
};
module.exports = {
    getUser: getUser,
    sendUserList: sendUserList
};
