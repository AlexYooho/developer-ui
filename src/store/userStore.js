import { USER_STATE } from "../utils/enums.js"
import api from '../api/api.js'

export default {
    state: {
        userInfo: {},
        state: USER_STATE.FREE
    },

    mutations: {
        setUserInfo(state, userInfo) {
            state.userInfo = userInfo
        },
        setUserState(state, userState) {
            state.state = userState
        },
        clear(state) {
            state.userInfo = {},
                state.state = USER_STATE.FREE
        }
    },
    actions: {
        loadUser(context) {
            return new Promise((resolve, reject) => {
                api.getSelf().then(userInfo=>{
                    context.commit("setUserInfo", userInfo);
                    resolve();
                }).catch(res=>{
                    sessionStorage.removeItem("accessToken");
                    this.$router.push("/home/chat");
                    reject(res);
                })
            })
        }
    }
}