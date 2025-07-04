import {
    MESSAGE_STATUS,
    MESSAGE_TYPE
} from "../utils/enums.js"
import userStore from "./userStore.js";

export default {
    state: {
        activeIndex: -1,
		private_msg_max_id: 0,
		group_msg_max_id: 0,
		loadingPrivateMsg: false,
		loadingGroupMsg: false,
		chats: []
    },

    mutations:{
        initChats(state, chatsData) {
			state.chats = chatsData.chats || [];
			state.private_msg_max_id = chatsData.private_msg_max_id || 0;
			state.group_msg_max_id = chatsData.group_msg_max_id || 0;
			// 防止图片一直处在加载中状态
			state.chats.forEach((chat) => {
				chat.messages.forEach((msg) => {
					if (msg.loadStatus == "loading") {
						msg.loadStatus = "fail"
					}
				})
			})
		},
		openChat(state, chatInfo) {
			let chat = null;
			let activeChat = state.activeIndex >= 0 ? state.chats[state.activeIndex] : null;
			for (let i in state.chats) {
				if (state.chats[i].type == chatInfo.type &&
					state.chats[i].targetId === chatInfo.targetId) {
					chat = state.chats[i];
					// 放置头部
					state.chats.splice(i, 1);
					state.chats.unshift(chat);
					break;
				}
			}
			// 创建会话
			if (chat == null) {
				chat = {
					targetId: chatInfo.targetId,
					type: chatInfo.type,
					showName: chatInfo.showName,
					headImage: chatInfo.headImage,
					lastContent: "",
					lastSendTime: new Date().getTime(),
					unreadCount: 0,
					messages: [],
				};
				state.chats.unshift(chat);
			}
			// 选中会话保持不变
			if (activeChat) {
				state.chats.forEach((chat, idx) => {
					if (activeChat.type == chat.type &&
						activeChat.targetId == chat.targetId) {
						state.activeIndex = idx;
					}
				})
			}
		},
		insertMessage(state,msgInfo) {
			let type = msgInfo.group_id?'GROUP':'PRIVATE';
			let targetId = msgInfo.group_id ? msgInfo.group_id : msgInfo.self_send ? msgInfo.receiver_id : msgInfo.send_id;
			let chat = null;
			for (let idx in state.chats) {
				if (state.chats[idx].type == type &&
					state.chats[idx].targetId === targetId) {
					chat = state.chats[idx];
					break;
				}
			}

			// 插入新的数据
			if (msgInfo.message_content_type == MESSAGE_TYPE.IMAGE) {
				chat.lastContent = "[图片]";
			} else if (msgInfo.message_content_type == MESSAGE_TYPE.FILE) {
				chat.lastContent = "[文件]";
			} else if (msgInfo.message_content_type == MESSAGE_TYPE.RED_PACKETS) {
				chat.lastContent = "[红包]";
			} else if (msgInfo.message_content_type == MESSAGE_TYPE.TRANSFER) {
				chat.lastContent = "[转账]";
			} else {
				chat.lastContent = msgInfo.message_content;
			}
			chat.lastSendTime = msgInfo.send_time;
			chat.sendNickName = msgInfo.send_nickname;
			// 未读加1
			if (!msgInfo.self_send && msgInfo.message_status != MESSAGE_STATUS.READED) {
				chat.unreadCount++;
			}
			// 是否有人@我
			if(!msgInfo.self_send && chat.type=="GROUP" && msgInfo.at_user_ids){
				let userId = userStore.state.userInfo.id;
				if(msgInfo.at_user_ids.indexOf(userId)>=0){
					chat.atMe = true;
				}
				if(msgInfo.at_user_ids.indexOf(-1)>=0){
					chat.atAll = true;
				}
			}
			// 记录消息的最大id
			if (msgInfo.id && type == "PRIVATE" && msgInfo.id > state.private_msg_max_id) {
				state.private_msg_max_id = msgInfo.id;
			}
			if (msgInfo.id && type == "GROUP" && msgInfo.id > state.group_msg_max_id) {
				state.group_msg_max_id = msgInfo.id;
			}
			// 如果是已存在消息，则覆盖旧的消息数据
			for (let idx in chat.messages) {
				if (msgInfo.id && chat.messages[idx].id == msgInfo.id) {
					Object.assign(chat.messages[idx], msgInfo);
					this.commit("saveToStorage");
					return;
				}
				// 正在发送中的消息可能没有id,通过发送时间判断
				if (msgInfo.self_send && chat.messages[idx].self_send && chat.messages[idx].send_time == msgInfo.send_time) {
					Object.assign(chat.messages[idx], msgInfo);
					this.commit("saveToStorage");
					return;
				}
			}
			// 间隔大于10分钟插入时间显示
			if (chat.lastTimeTip!=undefined && (!chat.lastTimeTip || (chat.lastTimeTip < msgInfo.send_time - 600 * 1000))) {
				chat.messages.push({
					send_time: msgInfo.send_time,
					type: MESSAGE_TYPE.TIP_TIME,
				});
				chat.lastTimeTip = msgInfo.send_time;
			}
			// 新的消息
			chat.messages.push(msgInfo);
			this.commit("saveToStorage");
		},
		activeChat(state, idx) {
			state.activeIndex = idx;
		},
		removeChat(state, idx) {
			state.chats.splice(idx, 1);
			if (state.activeIndex >= state.chats.length) {
				state.activeIndex = state.chats.length - 1;
			}
			this.commit("saveToStorage");
		},
		moveTop(state, idx) {
			let chat = state.chats[idx];
			// 放置头部
			state.chats.splice(idx, 1);
			state.chats.unshift(chat);
			this.commit("saveToStorage");
		},
		loadingPrivateMsg(state, loadding) {
			state.loadingPrivateMsg = loadding;
		},
		loadingGroupMsg(state, loadding) {
			state.loadingGroupMsg = loadding;
		},
		saveToStorage(state) {
			let userId = userStore.state.userInfo.id;
			let key = "chats-" + userId;
			let chatsData = {
				private_msg_max_id: state.private_msg_max_id,
				group_msg_max_id: state.group_msg_max_id,
				chats: state.chats
			}
			localStorage.setItem(key, JSON.stringify(chatsData));
		},
		clear(state) {
			state.activeIndex = -1;
			state.chats = [];
		},
		resetUnreadCount(state, chatInfo) {
			for (let idx in state.chats) {
				if (state.chats[idx].type == chatInfo.type &&
					state.chats[idx].targetId == chatInfo.targetId) {
					state.chats[idx].unreadCount = 0;
					state.chats[idx].atMe = false;
					state.chats[idx].atAll = false; 
					for(let i in state.chats[idx].messages){
						if(chatInfo.messageId==state.chats[idx].messages[i].id){
							state.chats[idx].messages[i].message_status=chatInfo.messageStatus;
							state.chats[idx].messages[i].read_count+=1;
							state.chats[idx].messages[i].un_read_count-=1;
						}
					}
				}
			}
			this.commit("saveToStorage");
		},
		updateChatFromFriend(state, friend) {
			for (let i in state.chats) {
				let chat = state.chats[i];
				if (chat.type == 'PRIVATE' && chat.targetId == friend.id) {
					chat.headImage = friend.headImageThumb;
					chat.showName = friend.nickname;
					break;
				}
			}
			this.commit("saveToStorage");
		},
		updateChatFromGroup(state,group){
			for(let i in state.chats){
				let chat = state.chats[i];
				if(chat.type=='GROUP' && chat.targetId==group.id){
					chat.headImage=group.headImageThumb;
					chat.showName=group.name;
					break;
				}
			}
		},
		readedMessage(state, friendId) {
			for (let idx in state.chats) {
				if (state.chats[idx].type == 'PRIVATE' &&
					state.chats[idx].targetId == friendId) {
					state.chats[idx].messages.forEach((m) => {
						let messageStatus = MESSAGE_STATUS.RECALL;
						if (m.self_send && m.message_status != messageStatus) {
							messageStatus = MESSAGE_STATUS.READED;
							m.message_status = messageStatus
						}
					})
				}
			}
			this.commit("saveToStorage");
		},
		deleteMessage(state,msgInfo){
			let type = msgInfo.groupId?'GROUP':'PRIVATE';
			let targetId = msgInfo.groupId ? msgInfo.groupId : msgInfo.selfSend ? msgInfo.recvId : msgInfo.sendId;
			let chat = null;
			for(let idx in state.chats){
				if(state.chats[idx].type==type && state.chats[idx].targetId==targetId){
					chat = state.chats[idx];
					break;
				}
			}

			for(let idx in chat.messages){
				if(chat.messages[idx].id && chat.messages[idx].id==msgInfo.id){
					chat.messages.splice(idx,1);
					break;
				}
				if(msgInfo.self_send && chat.messages[idx].self_send && chat.messages[idx].send_time==msgInfo.send_time){
					chat.messages.splice(idx,1);
					break;
				}
			}
			this.commit("saveToStorage");
		}
    },

    actions: {
        loadChat(context) {
            return new Promise((resolve,reject) => {
                let userId = userStore.state.userInfo.id;
                let key = "chats-"+userId;
                let item = localStorage.getItem(key)
                if(item){
                    let chatsData = JSON.parse(item);
                    context.commit("initChats",chatsData);
                }
                resolve();
            });
        }
    }
}