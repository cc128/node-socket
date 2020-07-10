const socket = server => {
    let linkUser = {}; //----------------------------------------连接用户
    let videoLinkUser; //----------------------------------------连接用户-视频语音
    let anchorList; //-------------------------------------------连接用户-开播列表
    const io = require("socket.io")(server);
    io.on("connection", socket => {
        socket.emit("socketId", socket.id); //--------------------给连接人发送他的id
        socket.on("userLink", data => {
            setLinkUser(socket, data); //-------------------------存储连接用户
            console.log("连接用户", linkUser);
            sendVideoLinkUserList(); //---------------------------发送-可视频语音用户
        });
        //--------------------------------------------------------连接用户修改名称
        socket.on("setName", data => {
            linkUser[data.socketId].name = data.name;
            setVideoLinkUser(); //--------------------------------存储-可视频语音用户
            sendVideoLinkUserList(); //---------------------------发送-可视频语音用户
        });
        const videoCall = require("./video-call");
        videoCall.videoCall(socket);
        //--------------------------------------------------------客户端断开连接
        socket.on("disconnect", err => {
            delete linkUser[socket.id]; //------------------------删除离开用户信息
            setVideoLinkUser(); //--------------------------------存储-可视频语音用户
            setAnchorList(); //-----------------------------------存储-开直播的用户
            sendVideoLinkUserList(); //---------------------------发送-可视频语音用户
        });
    });
    // -----------------------------------------------------------存储连接用户
    const setLinkUser = (socket, data) => {
        linkUser[socket.id] = {};
        linkUser[socket.id] = data;
        setVideoLinkUser(); //------------------------------------存储-可视频语音用户
    };
    //------------------------------------------------------------发送-可视频语音用户
    const sendVideoLinkUserList = () => {
        io.emit("videoLinkUserList", videoLinkUser);
    };
    // -----------------------------------------------------------存储-可视频语音用户
    const setVideoLinkUser = () => {
        videoLinkUser = Object.values(linkUser).filter(e => {
            return e.type === "视频语音";
        });
    };
    // ------------------------------------------------------------存储-开直播的用户
    const setAnchorList = () => {
        anchorList = Object.values(linkUser).filter(e => {
            return e.type === "开直播";
        });
    };
    // const getLinkUser = socket => {
    //     return Object.keys(socket.adapter.rooms);
    // };
};
exports.socket = socket;
