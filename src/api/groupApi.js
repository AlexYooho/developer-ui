import http from '../utils/http'

const groupApi = {
    // group相关
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

    // 获取群
    getGroup(groupId){
        return http.GET(`/group-module/api/group/find/${groupId}`);
    },

    // 邀请入群
    inviteJoinGroup(param){
        return http.POST(`/group-module/api/group/invite`,param);
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
    }
};

export default groupApi;