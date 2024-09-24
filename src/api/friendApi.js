import http from '../utils/http'

const friendApi = {
    // friend相关
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

    // 获取好友列表
    getFriendList() {
        return http.GET(`/friend-module/api/friend/list`);
    },

    // 获取好友添加请求数
    getfriendAddRequestCount(){
        return http.GET(`/friend-module/api/friend/list`);
    },

    // 通过id查询好友
    findFriedById(id){
        return http.GET(`/friend-module/api/friend/find/${id}`);
    }
};

export default friendApi;