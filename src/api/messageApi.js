import http from '../utils/http'

const messageApi = {
    // message相关
    // 获取私聊消息列表
    getPrivateMessageList(miniId){
        return http.GET(`/message-module/api/message/0/loadMessage?minId=${miniId}`);
    },

    // 获取群聊消息列表
    getGroupMessageList(miniId){
        return http.GET(`/message-module/api/message/1/loadMessage?minId=${miniId}`);
    },

    // 获取历史消息
    getHistoryMessage(chatType,param){
        let type = chatType == "private" ? 0 : 1;
        return http.GET(`/message-module/api/message/${type}/history`,param);
    },

    // 发送消息
    sendMessage(chatType,param){
        let type = chatType == "private" ? 0 : 1;
        return http.POST(`/message-module/api/message/${type}/send`,param);
    },

    // 撤回消息
    recallMessage(chatType,msgId){
        let type = chatType == "private" ? 0 : 1;
        return http.POST(`/message-module/api/message/${type}/recall/${msgId}`);
    },

    // 已读消息
    readedMessage(chatType,targetId){
        let type = chatType == "private" ? 0 : 1;
        return http.POST(`/message-module/api/message/${type}/readed?targetId=${targetId}`);
    }
};

export default messageApi;