import http from '../utils/http'

const userApi = {
    // 登录
    login(param){
        return http.POST(`/sso-module/api/sso/login`,param);
    },
    
    // 用户相关
    // 当前用户信息
    getSelf(){
        return http.GET('/user-module/api/user/selfInfo');
    },

    // 获取用户信息
    findUserInfo(userId){
        let data = {
            user_id : userId
        };
        return http.POST(`/user-module/api/user/find`,data);
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

    // 在线终端
    getOnlineTerminal(ids){
        return http.GET(`/user-module/api/user/online/terminal?user_ids=${ids}`);
    }
};

export default userApi;