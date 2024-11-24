<template>
	<div class="chat-box" @click="closeRefBox()" @mousemove="readedMessage()">
		<el-container>
			<el-header height="60px" style="display: flex">
				<span style="margin-left: 15px">{{ title }}</span>
				<span title="群聊消息" v-show="this.chat.type == 'GROUP'" class="btn-side el-icon-more"
					@click="showSidess()"></span>
			</el-header>
			<el-main style="padding: 0">
				<el-container>
					<el-container class="content-box">
						<el-main class="im-chat-main" id="chatScrollBox" @scroll="onScroll">
							<div class="im-chat-box" id="chatContentBox" @click="closeHistotyMessageBox()">
								<ul>
									<li v-for="(msgInfo, idx) in chat.messages" :key="idx">
										<chat-message-item v-show="idx >= showMinIdx" :mine="msgInfo.sendId == mine.id"
											:headImage="headImage(msgInfo)" :showName="showName(msgInfo)" :msgInfo="msgInfo"
											:targetId="chat.targetId"
											@delete="deleteMessage"
											@recall="recallMessage"></chat-message-item>
									</li>
								</ul>
							</div>
						</el-main>
						<el-footer height="38.5%" class="im-chat-footer">
							<div class="chat-tool-bar">
								<div title="表情" class="icon iconfont icon-biaoqing" ref="emotion"
									@click.stop="showEmotionBox()"></div>
								<div title="发送图片">
									<file-upload :action="imageAction" :maxSize="5 * 1024 * 1024" :fileTypes="[
										'image/jpeg',
										'image/png',
										'image/jpg',
										'image/webp',
										'image/gif',
									]" @before="onImageBefore" @success="onImageSuccess" @fail="onImageFail">
										<i class="el-icon-picture-outline"></i>
									</file-upload>
								</div>
								<div title="发送文件">
									<file-upload :action="fileAction" :maxSize="10 * 1024 * 1024" @before="onFileBefore"
										@success="onFileSuccess" @fail="onFileFail">
										<i class="el-icon-wallet"></i>
									</file-upload>
								</div>
								<div title="发送语音" class="el-icon-microphone" @click="showVoiceBox()"></div>
								<div title="视频聊天" v-show="chat.type == 'PRIVATE'" class="el-icon-phone-outline"
									@click="showVideoBox()"></div>
								<div title="聊天记录" class="el-icon-chat-dot-round" @click="showHistoryBox()"></div>
							</div>
							<div class="send-content-area">
								<div contenteditable="true" v-show="!sendImageUrl" ref="editBox" class="send-text-area"
									:disabled="lockMessage" @paste.prevent="onEditorPaste"
									@compositionstart="onEditorCompositionStart" @compositionend="onEditorCompositionEnd"
									@input="onEditorInput" @blur="onEditBoxBlur()"
									@keydown.down="onKeyDown" @keydown.up="onKeyUp" @keydown.enter.prevent="onKeyEnter($event)" 
									@keyup.ctrl.enter.exact="changeLine($event)"
									@keyup.enter.exact="changeLine($event,'enter')">
								</div>

								<div v-show="sendImageUrl" class="send-image-area">
									<div class="send-image-box">
										<img class="send-image" :src="sendImageUrl" />
										<span class="send-image-close el-icon-close" title="删除"
											@click="removeSendImage()"></span>
									</div>
								</div>
								<div class="send-btn-area">
									<el-button type="primary" size="small" @click="sendMessage()">发送</el-button>
								</div>
							</div>
						</el-footer>
					</el-container>
					<el-aside class="chat-group-side-box" width="300px" v-show="showSide">
						<chat-group-side :group="group" :groupMembers="groupMembers"
							@reload="loadGroup(group.id)"></chat-group-side>
					</el-aside>
					<el-aside class="chat-group-side-box" width="400px" v-show="showHistory">
						<chat-history :visible="showHistory" :chat="chat" :friend="friend" :group="group" :groupMembers="groupMembers"
				@close="closeHistoryBox"></chat-history>
					</el-aside>
				</el-container>
			</el-main>
			<emotion ref="emoBox" @emotion="onEmotion"></emotion>
			<chat-voice :visible="showVoice" @close="closeVoiceBox" @send="onSendVoice"></chat-voice>
			
			<chat-at-box ref="atBox" :ownerId="group.ownerId" :members="groupMembers" :search-text="atSearchText"
				@select="onAtSelect"></chat-at-box>
		</el-container>
	</div>
</template>

<script>
import ChatGroupSide from "./ChatGroupSide.vue";
import ChatMessageItem from "./ChatMessageItem.vue";
import FileUpload from "../common/FileUpload.vue";
import Emotion from "../common/Emotion.vue";
import ChatVoice from "./ChatVoice.vue";
import ChatHistory from "./ChatHistory.vue";
import ChatAtBox from "./ChatAtBox.vue";

export default {
	name: "chatPrivate",
	components: {
		ChatMessageItem,
		FileUpload,
		ChatGroupSide,
		Emotion,
		ChatVoice,
		ChatHistory,
		ChatAtBox,
	},
	props: {
		chat: {
			type: Object,
		},
	},
	data() {
		return {
			friend: {},
			group: {},
			groupMembers: [],
			sendImageUrl: "",
			sendImageFile: "",
			showVoice: false, // 是否显示语音录制弹窗
			showSide: false, // 是否显示群聊信息栏
			showHistory: false, // 是否显示历史聊天记录
			lockMessage: false, // 是否锁定发送，
			showMinIdx: 0, // 下标低于showMinIdx的消息不显示，否则页面会很卡
			atSearchText: "",
			focusNode: null, // 缓存光标所在节点
			focusOffset: null, // 缓存光标所在节点位置
			zhLock: false, // 解决中文输入法触发英文的情况
			imageIndex: 0, // 图片索引
		};
	},
	methods: {
		// 关闭弹窗
		closeRefBox() {
			this.$refs.emoBox.close();
			this.$refs.atBox.close();
		},

		closeHistotyMessageBox(){
			this.closeHistoryBox();
			this.onCloseSide();
		},

		// 方向键事件
		// 方向键向下
		onKeyDown() {
			if (this.$refs.atBox.show) {
				this.$refs.atBox.moveDown();
			}
		},
		// 方向键向上
		onKeyUp() {
			if (this.$refs.atBox.show) {
				this.$refs.atBox.moveUp();
			}
		},
		// enter
		onKeyEnter(e) {
			if(e.ctrlKey){
				return;
			}
			if (this.$refs.atBox.show) {
				this.focusOffset += this.atSearchText.length;
				this.$refs.atBox.select();
			} else {
				this.sendMessage();
			}
		},

		changeLine(e){
			let _this = this;
			if(e.ctrlKey && e.keyCode==13){
				document.execCommand('insertHTML', false, '\n<br/>&zwnj;');
  				e.preventDefault();
			}
		},

		// 文本框事件
		// 文本框光标事件
		onEditBoxBlur() {
			let selection = window.getSelection();
			// 记录光标位置(点击emoji时)
			this.focusNode = selection.focusNode;
			this.focusOffset = selection.focusOffset;
		},
		// 文本框输入事件
		onEditorInput(e) {
			// 如果触发 @
			if (this.chat.type == "GROUP" && !this.zhLock) {
				if (e.data == "@") {
					// 打开选择弹窗
					this.showAtBox(e);
				} else {
					let selection = window.getSelection();
					let range = selection.getRangeAt(0);
					this.focusNode = selection.focusNode;
					// 截取@后面的名称作为过滤条件
					let stIdx = this.focusNode.textContent.lastIndexOf("@");
					this.atSearchText = this.focusNode.textContent.substring(stIdx + 1);
				}
			}
		},
		// 解决中文输入法触发英文的情况
		onEditorCompositionStart() {
			this.zhLock = true;
		},
		// 解决中文输入法触发英文的情况
		onEditorCompositionEnd(e) {
			this.zhLock = false;
			this.onEditorInput(e);
		},
		// 文本框粘贴事件
		onEditorPaste(e) {
			let txt = event.clipboardData.getData('Text');
			if (typeof (txt) == 'string') {
				let range = window.getSelection().getRangeAt(0)
				let textNode = document.createTextNode(txt);
				range.insertNode(textNode);
				range.collapse();
			}

			let items = (event.clipboardData || window.clipboardData).items;
			if (items.length) {
				for (let i = 0; i < items.length; i++) {
					if (items[i].type.indexOf('image') !== -1) {
						let file = items[i].getAsFile();
						this.sendImageFile = file;
						this.sendImageUrl = URL.createObjectURL(file);
					}
				}
			}
		},
		// 重置输入框
		resetEditor() {
			this.sendImageUrl = "";
			this.sendImageFile = null;
			this.$nextTick(() => {
				this.$refs.editBox.innerHTML = "";
				this.$refs.editBox.focus();
			});
		},

		// at事件
		// at弹窗打开事件
		showAtBox(e) {
			this.atSearchText = "";
			let selecetion = window.getSelection();
			let range = selecetion.getRangeAt(0);
			this.focusNode = selecetion.focusNode;
			this.focusOffset = selecetion.focusOffset;
			let pos = range.getBoundingClientRect();
			this.$refs.atBox.open({
				x: pos.x,
				y: pos.y,
			});
		},
		// at选中事件
		onAtSelect(member) {
			let range = window.getSelection().getRangeAt(0);
			// 选中输入的 @xx 符
			range.setStart(
				this.focusNode,
				this.focusOffset - 1 - this.atSearchText.length
			);
			range.setEnd(this.focusNode, this.focusOffset);
			range.deleteContents();
			// 创建元素节点
			let element = document.createElement("SPAN");
			element.className = "at";
			element.dataset.id = member.userId;
			element.contentEditable = "false";
			element.innerText = `@${member.aliasName}`;
			range.insertNode(element);
			// 光标移动到末尾
			range.collapse();
			// 插入空格
			let textNode = document.createTextNode("\u00A0");
			range.insertNode(textNode);
			range.collapse();
			this.atSearchText = "";
			this.$refs.editBox.focus();
		},
		// 创建at对象
		createAtUserIds() {
			let ids = [];
			this.$refs.editBox.childNodes.forEach((node) => {
				if (node.nodeName == "SPAN") {
					ids.push(node.dataset.id);
				}
			});
			return ids;
		},

		// 消息事件
		// 发送消息
		sendMessage() {
			if (this.sendImageFile) {
				this.sendImageMessage();
			} else {
				this.sendTextMessage();
			}
			this.readedMessage();
		},
		// 发送图片信息
		sendImageMessage() {
			let file = this.sendImageFile;
			this.onImageBefore(this.sendImageFile);
			let formData = new FormData();
			formData.append('file', file.raw || file);
			this.$api.uploadImage(formData,{
				headers: {
					'Content-type': 'multipart/form-data'
				}
			}).then((data) => {
				this.onImageSuccess(data, file);
			}).catch((res) => {
				this.onImageSuccess(res, file);
			})
			this.sendImageFile = null;
			this.sendImageUrl = "";
			this.$nextTick(() => this.$refs.editBox.focus());
			this.scrollToBottom();
		},
		// 发送文本消息
		sendTextMessage() {
			let sendText = this.createSendText();
			if (!sendText.trim() || sendText.replace(/[\r\n]/g, '')=='') {
				return;
			}

			this.$refs.editBox.cle;
			let msgInfo = {
				messageContent: sendText,
				messageMainType: 0,
				messageContentType:0
			};

			this.fillTargetId(msgInfo, this.chat.targetId);
			if (this.chat.type == "GROUP") {
				msgInfo.atUserIds = this.createAtUserIds();
			}

			this.lockMessage = true;
			this.$api.sendMessage(this.chat.type.toLowerCase(),msgInfo).then((res) => {
					msgInfo.id = res.id;
					msgInfo.selfSend = true;
					msgInfo.sendId = this.$store.state.userStore.userInfo.id;
					msgInfo.sendTime = new Date().getTime();
					msgInfo.messageStatus = this.$enums.MESSAGE_STATUS.UNSEND;
					msgInfo.unReadCount=res.unReadCount;
					msgInfo.readCount=res.readCount;

					this.$store.commit("insertMessage", msgInfo);
				})
				.finally(() => {
					this.lockMessage = false;
					this.scrollToBottom();
					this.resetEditor();
				});
		},
		// 删除消息
		deleteMessage(msgInfo) {
			this.$store.commit("deleteMessage", msgInfo);
		},
		// 撤回消息
		recallMessage(msgInfo) {
			this.$api.recallMessage(this.chat.type.toLowerCase(),msgInfo.id).then((res) => {
				this.$message.success("消息已撤回");
				msgInfo = JSON.parse(JSON.stringify(msgInfo));
				msgInfo.messageContentType = 0;
				msgInfo.messageContent = "你撤回了一条消息";
				msgInfo.messageStatus = this.$enums.MESSAGE_STATUS.RECALL;
				this.$store.commit("insertMessage", msgInfo);
			});
		},
		// 已读消息
		readedMessage() {
			if (this.chat.unreadCount == 0) {
				return;
			}
			this.chat.unreadCount = 0;
			this.$api.readedMessage(this.chat.type.toLowerCase(),this.chat.targetId).then(() => {
				this.$store.commit("resetUnreadCount", this.chat);
			});
		},
		// 创建发送文本
		createSendText() {
			let sendText = "";
			this.$refs.editBox.childNodes.forEach((node) => {
				if (node.nodeName == "#text") {
					sendText += node.textContent;
				} else if (node.nodeName == "SPAN") {
					sendText += node.innerText;
				} else if (node.nodeName == "IMG") {
					sendText += node.dataset.code;
				}
			});
			return sendText;
		},
		// 移除发送图片
		removeSendImage() {
			this.sendImageUrl = "";
			this.sendImageFile = null;
		},
		// 图片发送成功事件
		onImageSuccess(data, file) {
			let msgInfo = JSON.parse(JSON.stringify(file.msgInfo || file.raw.msgInfo));
			msgInfo.messageContent=JSON.stringify(data);
			this.$api.sendMessage(this.chat.type.toLowerCase(),msgInfo).then((id) => {
				msgInfo.loadStatus = 'ok';
				msgInfo.id = id;
				this.$store.commit("insertMessage", msgInfo);
			})
		},
		// 图片发送失败事件
		onImageFail(e, file) {
			let msgInfo = JSON.parse(JSON.stringify(file.msgInfo || file.raw.msgInfo));
			msgInfo.loadStatus = 'fail';
			this.$store.commit("insertMessage", msgInfo);
		},
		// 发送图片之前
		onImageBefore(file) {
			let url = URL.createObjectURL(file);
			let data = {
				originUrl: url,
				thumbUrl: url
			}
			let msgInfo = {
				id: 0,
				fileId: file.uid,
				sendId: this.mine.id,
				messageMainType: 0,
				messageContent: JSON.stringify(data),
				messageContentType: 1,
				sendTime: new Date().getTime(),
				messageStatus: this.$enums.MESSAGE_STATUS.UNSEND,
				selfSend: true,
				loadStatus: "loading"
			}
			this.fillTargetId(msgInfo, this.chat.targetId);
			this.$store.commit("insertMessage", msgInfo);
			this.scrollToBottom();
			file.msgInfo = msgInfo;
		},
		// 发送文件成功事件
		onFileSuccess(url, file) {
			let data = {
				name: file.name,
				size: file.size,
				url: url
			}

			let msgInfo = JSON.parse(JSON.stringify(file.raw.msgInfo));
			msgInfo.content = JSON.stringify(data);
			this.$api.sendMessage(this.chat.type.toLowerCase(),msgInfo).then((id) => {
				msgInfo.loadStatus = 'ok';
				msgInfo.id = id;
				this.$store.commit("insertMessage", msgInfo);
			})
		},
		// 发送文件失败事件
		onFileFail(e, file) {
			let msgInfo = JSON.parse(JSON.stringify(file.raw.msgInfo));
			msgInfo.loadStatus = 'fail';
			this.$store.commit("insertMessage", msgInfo);
		},
		// 发送文件之前处理
		onFileBefore(file) {
			let url = URL.createObjectURL(file);
			let data = {
				name: file.name,
				size: file.size,
				url: url
			}

			let msgInfo = {
				id: 0,
				sendId: this.mine.id,
				content: JSON.stringify(data),
				sendTime: new Date().getTime(),
				selfSend: true,
				type: 2,
				loadStatus: "loading",
				status: this.$enums.MESSAGE_STATUS_UNSEND
			}
			this.fillTargetId(msgInfo, this.chat.targetId);
			this.$store.commit("insertMessage", msgInfo);
			this.scrollToBottom();
			file.msgInfo = msgInfo;
		},

		// 语音视频
		// 展示录音弹窗
		showVoiceBox() { },
		// 关闭录音弹窗
		closeVoiceBox() { },
		// 发送语音
		onSendVoice(data) { },
		// 展示视频弹窗
		showVideoBox() { },
		// 展示历史数据弹窗
		showHistoryBox() {
			if(this.showHistory == true){
				this.showHistory=false;
				this.onCloseSide();
				return;
			}

			if(this.showHistory == false){
				this.showHistory=true;
				this.onCloseSide();
				return;
			}
			
		 },
		// 关闭历史数据弹窗
		closeHistoryBox() { 
			this.showHistory = false;
		},
		

		// 表情
		// 展示表情弹窗
		showEmotionBox() {
			let width = this.$refs.emotion.offsetWidth;
			let left = this.$elm.fixLeft(this.$refs.emotion);
			let top = this.$elm.fixTop(this.$refs.emotion);
			this.$refs.emoBox.open({
				x: left + width / 2,
				y: top,
			});
		},
		// 表情事件
		onEmotion(emoText) {
			// 保持输入框焦点
			this.$refs.editBox.focus();
			let range = window.getSelection().getRangeAt(0);
			// 插入光标所在位置
			range.setStart(this.focusNode, this.focusOffset);
			let element = document.createElement("IMG");
			element.className = "emo";
			element.dataset.code = emoText;
			element.contentEditable = "true";
			element.setAttribute("src", this.$emo.textToUrl(emoText));
			// 选中元素节点
			range.insertNode(element);
			// 光标移动到末尾
			range.collapse();
		},

		// 公共事件
		// 展示群聊信息栏
		showSidess() {
			if(this.showSide == true){
				this.showSide = false;
				this.closeHistoryBox();
				return;
			}

			if(this.showSide == false){
				this.showSide = true;
				this.closeHistoryBox();
				return;
			}
		},
		// 关闭群聊信息栏
		onCloseSide() {
			this.showSide = false;
		 },
		// 最多展示多少条信息
		onScrollToTop() { 
			this.showMinIdx = this.showMinIdx > 10 ? this.showMinIdx - 10 : 0;
		},
		// 消息滚动
		onScroll(e) {
			let scrollElement = e.target;
			let scrollTop = scrollElement.scrollTop;
			if (scrollTop < 30) {
				// 在顶部,不滚动的情况
				// 多展示20条信息
				this.showMinIdx = this.showMinIdx > 20 ? this.showMinIdx - 20 : 0;
			}
		},
		// 填充对方id
		fillTargetId(msgInfo, targetId) {
			if (this.chat.type == "GROUP") {
				msgInfo.groupId = targetId;
				msgInfo.messageMainType = 1;
			} else {
				msgInfo.receiverId = targetId;
				msgInfo.messageMainType = 0;
			}
		},
		// 加载群组
		loadGroup(groupId) {
			this.$api.getGroup(groupId).then((group) => {
				this.group = group;
				this.$store.commit("updateChatFromGroup", group);
				this.$store.commit("updateGroup", group);
			});

			this.$api.getGroupMembers(groupId).then((groupMembers) => {
				this.groupMembers = groupMembers;
			});
		},
		// 加载好友
		loadFriend(friendId) {
			this.$api.findUserInfo(friendId).then((friend) => {
				this.friend = friend;
				this.$store.commit("updateChatFromFriend", friend);
				this.$store.commit("updateFriend", friend);
			});
		},
		// 展示聊天室名称
		showName(msgInfo) {
			let name = "";
			if (this.chat.type == "GROUP") {
				let member = this.groupMembers.find((m) => m.userId == msgInfo.sendId);
				name = member ? member.aliasName : "";
			} else {
				name =
					msgInfo.sendId == this.mine.id
						? this.mine.nickname
						: this.chat.showName;
			}
			return name;
		},
		// 头像图片
		headImage(msgInfo) {
			if (this.chat.type == "GROUP") {
				let member = this.groupMembers.find((m) => m.userId == msgInfo.sendId);
				return member ? member.headImage : "";
			} else {
				return msgInfo.sendId == this.mine.id
					? this.mine.headImageThumb
					: this.chat.headImage;
			}
		},
		// 聊天界面自动滑动最低端
		scrollToBottom() {
			this.$nextTick(() => {
				let div = document.getElementById("chatScrollBox");
				div.scrollTop = div.scrollHeight;
			});
		},
	},
	computed: {
		mine() {
			return this.$store.state.userStore.userInfo;
		},
		title() {
			let title = this.chat.showName;
			if (this.chat.type == "GROUP") {
				let size = this.groupMembers.filter((m) => !m.quit).length;
				title += `(${size})`;
			}
			return title;
		},
		imageAction() {
			return `http://localhost:8090/oss/image/upload`;
		},
		fileAction() {
			return `http://localhost:8090/oss/file/upload`;
		},
		messageAction() {
			return `/message/${this.chat.type.toLowerCase()}/send`;
		},
		unreadCount() {
			return this.chat.unreadCount;
		},
	},
	watch: {
		chat: {
			handler(newChat, oldChat) {
				if (
					newChat.targetId > 0 &&
					(!oldChat ||
						newChat.type != oldChat.type ||
						newChat.targetId != oldChat.targetId)
				) {
					if (this.chat.type == "GROUP") {
						this.loadGroup(this.chat.targetId);
					} else {
						this.loadFriend(this.chat.targetId);
					}
					this.scrollToBottom();
					this.showSide = false;
					this.readedMessage();
					let size = this.chat.messages.length;
					this.showMinIdx = size > 30 ? size - 30 : 0;
					this.resetEditor();
				}
			},
			immediate: true,
		},
		unreadCount: {
			handler(newCount, oldCount) {
				if (newCount > 0) {
					// 拉至底部
					this.scrollToBottom();
				}
			},
		},
	},
	mounted() {
		let div = document.getElementById("chatScrollBox");
		div.addEventListener("scroll", this.onScroll);
	}
};
</script>

<style lang="scss">
.chat-box {
	position: relative;
	width: 100%;
	background: #f8f8f8;
	border-right: #dddddd solid 1px;

	.el-header {
		padding: 5px;
		background-color: white;
		line-height: 50px;
		font-size: 20px;
		font-weight: 600;
		border: #ddd solid 1px;
		border-radius: 0 10px 0 0;

		.btn-side {
			position: absolute;
			right: 20px;
			line-height: 60px;
			font-size: 15px;
			cursor: pointer;

			&:hover {
				font-size: 30px;
			}
		}
	}

	.im-chat-main {
		padding: 0;
		border-left: #ddd solid 1px;

		.im-chat-box {
			>ul {
				padding: 0 20px;

				li {
					list-style-type: none;
				}
			}
		}
	}

	.im-chat-footer {
		display: flex;
		flex-direction: column;
		padding: 0;
		border-left: #ddd solid 1px;
		border-bottom: #ddd solid 1px;

		.chat-tool-bar {
			display: flex;
			position: relative;
			width: 100%;
			height: 40px;
			text-align: left;
			box-sizing: border-box;
			border: #dddddd solid 1px;

			>div {
				margin-left: 10px;
				font-size: 22px;
				cursor: pointer;
				color: #333333;
				line-height: 40px;

				&:hover {
					color: black;
				}
			}
		}

		.send-content-area {
			position: relative;
			display: flex;
			flex-direction: column;
			height: 100%;
			background-color: white !important;

			.send-text-area {
				box-sizing: border-box;
				padding: 5px;
				width: 100%;
				flex: 1;
				resize: none;
				font-size: 16px;
				color: black;
				outline-color: rgba(83, 160, 231, 0.61);

				text-align: left;
				line-height: 30 px;

				.at {
					color: #05bec9;
					font-weight: 100;
				}

				.emo {
					width: 30px;
					height: 30px;
					vertical-align: bottom;
				}
			}

			.send-image-area {
				text-align: left;
				border: #53a0e7 solid 1px;

				.send-image-box {
					position: relative;
					display: inline-block;

					.send-image {
						max-height: 180px;
						border: 1px solid #ccc;
						border-radius: 2%;
						margin: 2px;
					}

					.send-image-close {
						position: absolute;
						padding: 3px;
						right: 7px;
						top: 7px;
						color: white;
						cursor: pointer;
						font-size: 15px;
						font-weight: 600;
						background-color: #aaa;
						border-radius: 50%;
						border: 1px solid #ccc;
					}
				}
			}

			.send-btn-area {
				padding: 10px;
				position: absolute;
				bottom: 0;
				right: 0;
			}
		}
	}

	.chat-group-side-box {
		border: #dddddd solid 1px;
		animation: rtl-drawer-in 0.3s 1ms;
	}
}
</style>