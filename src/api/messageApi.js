import http from '../utils/http'

const messageApi = {
    // message相关
    // 获取私聊消息列表
    getPrivateMessageList(miniId) {
        return http.GET(`/message-module/api/message/PRIVATE_MESSAGE/loadMessage/${miniId}`);
    },

    // 获取群聊消息列表
    getGroupMessageList(miniId) {
        return http.GET(`/message-module/api/message/GROUP_MESSAGE/loadMessage/${miniId}`);
    },

    // 获取历史消息
    getHistoryMessage(chatType, param) {
        chatType = chatType.toUpperCase() + "_MESSAGE";
        return http.POST(`/message-module/api/message/${chatType}/history`, param);
    },

    // 发送消息
    sendMessage(chatType, param) {
        chatType = chatType.toUpperCase() + "_MESSAGE";
        return http.POST(`/message-module/api/message/${chatType}/send`, param);
    },

    // 撤回消息
    recallMessage(chatType) {
        chatType = chatType.toUpperCase() + "_MESSAGE";
        return http.POST(`/message-module/api/message/${chatType}/withdraw`);
    },

    // 已读消息
    readedMessage(chatType, targetId) {
        chatType = chatType.toUpperCase() + "_MESSAGE";
        let param = {target_id: targetId};
        return http.POST(`/message-module/api/message/${chatType}/read`,param);
    }
};

export default messageApi;