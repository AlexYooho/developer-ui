import http from '../utils/httpRequest.js'
import {TERMINAL_TYPE} from '../utils/enums.js'
import api from '../api/api.js'

export default {
  state: {
    friends: [],
	newFriendRequestCount: 0,
    activeIndex: -1,
    timer: null
  },

  mutations: {
		setFriends(state, friends) {
			state.friends = friends;
		},
		setNewFriendsRequestCount(state,cnt){
			state.newFriendRequestCount=cnt;
		},
		updateFriend(state,friend){
			state.friends.forEach((f,index)=>{
				if(f.id==friend.id){
					// 拷贝属性
					let online = state.friends[index].online;
					Object.assign(state.friends[index], friend);
					state.friends[index].online =online;
				}
			})
		},
		activeFriend(state, index) {
			state.activeIndex = index;
		},
		removeFriend(state, index) {
			state.friends.splice(index, 1);
			state.activeIndex = -1;
		},
		addFriend(state, friend) {
			state.friends.push(friend);
		},
		refreshOnlineStatus(state){
			let userIds = [];
			if(state.friends.length ==0){
				return; 
			}
			state.friends.forEach((f)=>{userIds.push(f.id)});
			api.getOnlineTerminal(userIds.join(',')).then((onlineTerminals) => {
				this.commit("setOnlineStatus",onlineTerminals);
			})
			
			// 30s后重新拉取
			clearTimeout(state.timer);
			state.timer = setTimeout(()=>{
				this.commit("refreshOnlineStatus");
			},30000)
		},
		setOnlineStatus(state,onlineTerminals){
			state.friends.forEach((f)=>{
				let userTerminal = onlineTerminals.find((o)=> f.id==o.userId);
				if(userTerminal){
					f.online = true;
					f.onlineTerminals = userTerminal.terminals;
					f.onlineWeb = userTerminal.terminals.indexOf(TERMINAL_TYPE.WEB)>=0
					f.onlineApp = userTerminal.terminals.indexOf(TERMINAL_TYPE.APP)>=0
				}else{
					f.online = false;
					f.onlineTerminals = [];
					f.onlineWeb = false;
					f.onlineApp = false;
				}
			});
			let activeFriend = state.friends[state.activeIndex];
			state.friends.sort((f1,f2)=>{
				if(f1.online&&!f2.online){
					return -1;
				}
				if(f2.online&&!f1.online){
					return 1;
				}
				return 0;
			});

			// 重新排序后，activeIndex指向的好友可能会变化，需要重新指定
			if(state.activeIndex >=0){
				state.friends.forEach((f,i)=>{
					if(f.id == activeFriend.id){
						state.activeIndex = i;
					}
				})
			}
		},
		clear(state) {
			clearTimeout(state.timer);
			state.friends = [];
			state.timer = null;
			state.activeIndex = -1;
		}
	},

  actions: {
    loadFriend(context) {
      return new Promise((resolve, reject) => {
        api.getFriendList().then((friends) => {
          context.commit("setFriends", friends);
          context.commit("refreshOnlineStatus");
          resolve();
        }).catch((res) => {
          reject();
        })
      })
    },
	loadNewFriendRequestCount(context){
		return new Promise((resolve, reject) => {
			api.getfriendAddRequestCount().then((cnt) => {
			  context.commit("setNewFriendsRequestCount", cnt);
			  resolve();
			}).catch((res) => {
			  reject();
			})
		  })
	}
  }
}
