[{
    isSystem: false,
    type: "text",           // 文本消息
    msgId: "",
    time: "",
    sender: {
        id: "",
        name: "",
        url: "",
    },
    data: {
        msg: ""
    }
}, 
{
    isSystem: false,
    type: "image",          // 图片消息
    msgId: "",
    time: "",
    sender: {
        id: "",
        name: "",
        url: "",
    },
    data: {
        url: "",
        w: "",
        h: ""
    }
}, {
    isSystem: false,
    type: "sound",          // 语音消息
    msgId: "",
    time: "",
    sender: {
        id: "",
        name: "",
        url: "",
    },
    data: {
        url: "",
        duration: ""        // 语音时长 秒
    }
}, {
    isSystem: false,
    type: "reply",          // 回复消息
    msgId: "",
    time: "",
    sender: {
        id: "",
        name: "",
        url: "",
    },
    data: {
        repMsgId: "",       // 被回复的消息id
        type: "text",       // "image" "sound"
        msg: "",
        url: "",
        w: "",
        h: "",
        duration: ""
    }
}, {
    isSystem: true,
    type: "shutup",         // 个人禁言
    msgId: "",
    time: "",
    sender: {
        id: "",
        name: "",
        url: "",
    },
    data: {
        userId: "",
        name: "",
        toTime: ""
    }
}, {
    isSystem: true,
    type: "openup",        // 个人解禁
    msgId: "",
    time: "",
    sender: {
        id: "",
        name: "",
        url: "",
    },
    data: {
        userId: "",
        name: ""
    }
}, {
    isSystem: true,
    type: "shutupall",     // 全员禁言
    msgId: "",
    time: "",
    sender: {
        id: "",
        name: "",
        url: "",
    },
    data: {
        toTime: ""
    }
}, {
    isSystem: true,
    type: "openupall",     // 全员解禁
    msgId: "",
    time: "",
    sender: {
        id: "",
        name: "",
        url: "",
    }
}, {
    isSystem: true,
    type: "courseend",     // 课程结束
    msgId: "",
    time: ""
}, {
    isSystem: true,
    type: "robot",         // 值么助手
    msgId: "",
    time: "",
    data: {
        msg: ""
    }
}]