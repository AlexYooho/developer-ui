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
        return http.GET(`/message-module/api/message/${chatType}/history`,param);
    },

    // 发送消息
    sendMessage(chatType,param){
        return http.POST(`/message-module/api/message/${chatType}/send`,param);
    },

    // 撤回消息
    recallMessage(chatType,msgId){
        return http.POST(`/message-module/api/message/${chatType}/recall/${msgId}`);
    },

    // 已读消息
    readedMessage(chatType,targetId){
        if (chatType == "GROUP") {
            var url = `/message-module/api/message/group/readed?groupId=${targetId}`;
        } else {
            url = `/message-module/api/message/private/readed?friendId=${targetId}`;
        }
        return http.POST(url);
    }
};

export default messageApi;