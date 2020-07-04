const videoCall = socket => {
    // 启动呼叫
    socket.on("sendCall", data => {
        socket.to(data.called).emit("showCall", { ...data }); // 给被呼叫人发消息
    });
    //接受呼叫
    socket.on("tokeCall", data => {
        // console.log(`接受${data.callId}呼叫`);
        //通知呼叫人
        socket.emit("secretMsg", { isConsent: true, sendVideoId: data.callId });
        //通知被呼叫人
        socket.to(data.callId).emit("secretMsg", {
            isConsent: true,
            sendVideoId: data.called
        });
    });
    // 接收客户端发来的视频流
    socket.on("videoStreaming", data => {
        // 发送视频流给被呼叫人
        // console.log(`接收并发送视频流给${data.receiveUserId}`);
        socket.to(data.receiveUserId).emit("videoMsg", { video: data.video });
    });
    // 挂断呼叫
    socket.on("overCall", data => {
        socket.emit("secretMsg", { isConsent: false });
        if (data.state === 1) {
            // 呼叫方挂断
            socket.to(data.called).emit("secretMsg", { isConsent: false });
        } else if (data.state === 2) {
            // 被呼叫方挂断
            socket.to(data.callId).emit("secretMsg", { isConsent: false });
        }
    });
};
exports.videoCall = videoCall;
