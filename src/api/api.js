import { h } from 'vue';
import http from '../utils/http'


export default{
    // 当前用户信息
    getSelf(){
        return http.GET('/user-module/api/user/selfInfo');
    },
    // 获取私聊消息列表
    getPrivateMessageList(miniId){
        return http.GET(`/message-module/api/message/0/loadMessage?minId=${miniId}`);
    },

    // 获取群聊消息列表
    getGroupMessageList(miniId){
        return http.GET(`/message-module/api/message/1/loadMessage?minId=${miniId}`);
    },

    // 获取群成员
    getGroupMembers(groupId){
        return http.GET(`/group-module/api/group/${groupId}/members`);
    },

    // 修改群信息
    putGroupInfo(vo){
        return http.PUT(`/group-module/api/group/modify`,vo);
    },

    // 退出群聊
    quitGroup(groupId){
        return http.POST(`/group-module/api/group/${groupId}/quit`);
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
    },

    // 获取群
    getGroup(groupId){
        return http.GET(`/group-module/api/group/find/${groupId}`);
    },

    // 获取用户信息
    findUserInfo(userId){
        return http.GET(`/user-module/api/user/find/${userId}`);
    },

    // 登录
    login(param){
        return http.POST(`/sso-module/api/sso/login`,param);
    },

    // 注册
    register(param){
        return http.POST(`/user-module/api/user/register`,param);
    },

    // 修改用户信息
    updateUserInfo(param){
        return http.PUT(`/user-module/api/user/update`,param);
    },

    // 通过名字搜索用户
    getUserInfoByName(name){
        return http.GET(`/user-module/api/user/findByName?name=${name}`);
    },

    // 发送好友请求
    sendAddFriendRequest(param){
        return http.POST(`/friend-module/api/friend/sendAddFriendRequest`,param);
    },

    // 处理好友请求
    processFriendRequest(param){
        return http.POST(`/friend-module/api/friend/processFriendRequest`,param);
    },

    // 获取新好友列表
    getNewFriendList(){
        return http.GET(`/friend-module/api/friend/new/list`);
    },

    // 邀请入群
    inviteJoinGroup(param){
        return http.POST(`/group-module/api/group/invite`,param);
    },

    // 在线终端
    getOnlineTerminal(ids){
        return http.GET(`/user-module/api/user/online/terminal?userIds=${ids}`);
    },

    // 获取好友列表
    getFriendList() {
        return http.GET(`/friend-module/api/friend/list`);
    },

    // 获取好友添加请求数
    getfriendAddRequestCount(){
        return http.GET(`/friend-module/api/friend/list`);
    },

    // 获取群列表
    getGroupList(){
        return http.GET(`/group-module/api/group/list`);
    },

    // 创建群聊
    createGroupChat(groupName,param){
        return http.POST(`/group-module/api/group/create?groupName=${groupName}`,param);
    },

    // 删除群聊
    deleteGroup(groupId){
        return http.POST(`/group-module/api/group/delete/${groupId}`);
    },

    // 移出群聊
    kickGroupChat(groupId,userId){
        return http.POST(`/group-module/api/group/${groupId}/kick/${userId}`);
    },

    // 通过id查询好友
    findFriedById(id){
        return http.GET(`/friend-module/api/friend/find/${id}`);
    },

    // 文件上传
    uploadFile(param,headers){
        return http.POST(`/file/upload`,param,headers);
    },

    // 图片上传
    uploadImage(param,headers){
        return http.POST(`/oss/image/upload`,param,headers);
    }
}