const socket = server => {
    let linkUser = {}; //----------------------------------------连接用户
    let anchorList = []; //--------------------------------------连接用户-开播列表
    let lookLiveUser = []; //--------------------------------------连接用户-看直播的人
    const tool = require("./tool"); //---------------------------公共方法
    const io = require("socket.io")(server);
    io.on("connection", socket => {
        const videoCall = require("./video-call"); // ------------视频通话模块
        const live = require("./live"); // -----------------------直播模块
        socket.emit("socketId", socket.id); //--------------------给连接人发送他的id
        live.openLive(socket, linkUser, io, tool);
        socket.on("userLink", data => {
            setLinkUser(socket, data); //-------------------------存储-连接用户
            if (data.type === "视频语音") {
                tool.getUser(linkUser, "视频语音", io, socket);
                videoCall.videoCall(socket);
            }
            if (data.type === "开直播") {
                anchorList = tool.getUser(linkUser, "开直播", io, socket);
            }
            if (data.type === "看直播") {
                anchorList = tool.getUser(linkUser, "开直播", io, socket);
                lookLiveUser = tool.getUser(linkUser, "看直播", io, socket);
                tool.sendUserList(lookLiveUser, anchorList, io, socket);
            }
        });
        //--------------------------------------------------------连接用户修改名称
        socket.on("setName", data => {
            linkUser[data.socketId].name = data.name;
        });
        //--------------------------------------------------------客户端断开连接
        socket.on("disconnect", err => {
            delete linkUser[socket.id]; //------------------------删除离开用户信息
            tool.getUser(linkUser, "视频语音", io, socket);
        });
        //--------------------------------------------------------修改连接用户的type类型
        socket.on("setType", data => {
            // linkUser[data.socketId].type = data.newType; // ------用户type
            // tool.getUser(linkUser, data.formerType, io, socket);
        });
    });
    // -----------------------------------------------------------存储连接用户
    const setLinkUser = (socket, data) => {
        if (!linkUser[socket.id]) {
            linkUser[socket.id] = {};
        }
        linkUser[socket.id] = data;
    };
    // const getLinkUser = socket => {
    //     return Object.keys(socket.adapter.rooms);
    // };
};
exports.socket = socket;
