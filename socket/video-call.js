const videoCall = socket => {
    // 启动呼叫
    socket.on("sendCall", data => {
        socket.to(data.calledId).emit("showCall", { ...data }); // 给被呼叫人发消息
    });
    //接受呼叫
    socket.on("tokeCall", data => {
        //通知呼叫人
        socket.emit("secretMsg", { isConsent: true, sendVideoId: data.callId });
        //通知被呼叫人
        socket.to(data.callId).emit("secretMsg", {
            isConsent: true,
            sendVideoId: data.calledId
        });
    });
    // 接收客户端发来的视频流
    socket.on("videoStreaming", data => {
        socket.to(data.receiveUserId).emit("videoMsg", { video: data.video });
    });
    // 挂断呼叫
    socket.on("overCall", data => {
        socket.emit("secretMsg", { isConsent: false });
        if (data.who === 1) {
            // 呼叫方挂断
            socket.to(data.calledId).emit("secretMsg", { isConsent: false });
        } else if (data.who === 2) {
            // 被呼叫方挂断
            socket.to(data.callId).emit("secretMsg", { isConsent: false });
        }
    });
};
exports.videoCall = videoCall;
