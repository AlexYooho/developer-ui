<template>
     <div class="chat-history" v-loading="loading" element-loading-text="玩命加载中">
            <el-scrollbar class="chat-history-scrollbar" id ="historyScrollbar" ref="scrollbar">
                <ul>
                    <li v-for="(msgInfo,idx) in messages" :key="idx">
                        <chat-message-item :mode="2" :mine="msgInfo.sendId == mine.id" :headImage="headImage(msgInfo)" :showName="showName(msgInfo)"
						 :msgInfo="msgInfo" :menu="false" :targetId="chat.targetId"></chat-message-item>
                    </li>
                </ul>
            </el-scrollbar>
        </div>
</template>

<script>
import ChatMessageItem from './ChatMessageItem.vue';

export default{
    name:"chatHistory",
    components:{
        ChatMessageItem
    },
    props:{
        visible: {
				type: Boolean
			},
			chat: {
				type: Object
			},
			friend: {
				type: Object
			},
			group: {
				type: Object
			},
			groupMembers: {
				type: Array,
			}
    },
		data() {
			return {
				page: 1,
				size: 10,
				messages: [],
				loadAll: false,
				loading: false,
				lastScrollTime: new Date()
			}
		},
		methods: {
			onClose() {
				this.page=1;
				this.messages=[];
				this.loadAll=false;
				this.$emit('close');
			},
			onScroll() {
				let height = this.$refs.scrollbar.$refs.wrap.scrollTop; //距离顶部的距离
				let timeDiff = new Date().getTime() - this.lastScrollTime.getTime();
				if(height<30 && timeDiff>500){
					this.lastScrollTime = new Date();
					this.loadMessages();
				}
			},
			loadMessages() {
				if(this.loadAll){
					return;
				}

				let param = {
					page:this.page++,
					size:this.size
				}
				
				if(this.chat.type=='GROUP'){
					param.groupId = this.group.id;
				}else{
					param.friendId = this.friend.id;
				}

				this.loading = true;
				this.$api.getHistoryMessage(this.chat.type.toLowerCase(),param).then(message=>{
					message.forEach(m=>this.messages.unshift(m));
					this.loading=false;
					if(message.length<this.size){
						this.loadAll = true;
					}
					this.refreshScrollPos();
				}).catch(()=>{
					this.loading=false;
				})
			},
			showName(msgInfo) {
				if (this.chat.type == 'GROUP') {
					let member = this.groupMembers.find((m) => m.userId == msgInfo.sendId);
					return member ? member.aliasName : "";
				} else {
					return msgInfo.sendId == this.mine.id ? this.mine.nickname : this.chat.showName
				}
			},
			headImage(msgInfo) {
				if (this.chat.type == 'GROUP') {
					let member = this.groupMembers.find((m) => m.userId == msgInfo.sendId);
					return member ? member.headImage : "";
				} else {
					return msgInfo.sendId == this.mine.id ? this.mine.headImageThumb : this.chat.headImage
				}
			},
			refreshScrollPos(){
				let scrollWrap =  this.$refs.scrollbar.$refs.wrap;
				let scrollHeight = scrollWrap.scrollHeight;
				let scrollTop = scrollWrap.scrollTop;
				this.$nextTick(() => {
					let offsetTop = scrollWrap.scrollHeight - scrollHeight;
					scrollWrap.scrollTop = scrollTop + offsetTop;
					// 滚动条没出来，继续加载
					if(scrollWrap.scrollHeight == scrollHeight){
						this.loadMessages();
					}
				});
			}
		},
		computed: {
			mine() {
				return this.$store.state.userStore.userInfo;
			},
			histroyAction() {
				return `/message/${this.chat.type.toLowerCase()}/history`;
			}
		},
		watch: {
			visible: {
				handler(newValue, oldValue) {
					this.loadAll=false;
					this.page=0;
					this.messages=[];
					this.loadMessages();
						this.$nextTick(()=>{
							document.getElementById('historyScrollbar').addEventListener("mousewheel",this.onScroll,true)
						})
				}
			}
		}
}
</script>

<style lang="scss">
	.chat-history {
		display: flex;
		height: 100%;
		
		.chat-history-scrollbar {
			flex: 1;
			.el-scrollbar__thumb {
			    background-color: #555555;
			}
			ul {
				padding: 20px;

				li {
					list-style-type: none;
				}
			}
		}
	}
</style>