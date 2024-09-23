export default {
	state: {
		userInfo: { // 用户信息窗口
			show: false,
			user: {},
			pos: {
				x: 0,
				y: 0
			}
		},
		fullImage: { // 全屏大图
			show: false,
			url: ""
		},
		chatPrivateVideo: {  // 私人视频聊天
			show: false,
			master: false, // 是否房主
			friend: {},
			offer: {}  // 对方发起带过过来的sdp信息
		},
		videoAcceptor: { // 视频呼叫选择
			show: false,
			friend: {}
		}

	},
	mutations: {
		showUserInfoBox(state, user) {
			state.userInfo.show = true;
			state.userInfo.user = user;
		},
		setUserInfoBoxPos(state, pos) {
			state.userInfo.pos.x = pos.x-370;
			state.userInfo.pos.y = pos.y-140;
		},
		closeUserInfoBox(state) {
			state.userInfo.show = false;
		},
		showFullImageBox(state, url) {
			state.fullImage.show = true;
			state.fullImage.url = url;
		},
		closeFullImageBox(state) {
			state.fullImage.show = false;
		},
		showChatPrivateVideoBox(state, info) {
			state.chatPrivateVideo.show = true;
			state.chatPrivateVideo.friend = info.friend;
			state.chatPrivateVideo.master = info.master;
			state.chatPrivateVideo.offer = info.offer;
		},
		closeChatPrivateVideoBox(state) {
			state.chatPrivateVideo.show = false;
		},
		showVideoAcceptorBox(state, friend) {
			state.videoAcceptor.show = true;
			state.videoAcceptor.friend = friend;

		},
		closeVideoAcceptorBox(state) {
			state.videoAcceptor.show = false;
		}
	}
}