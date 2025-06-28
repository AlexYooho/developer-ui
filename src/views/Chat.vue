<template>
  <el-container>
    <el-aside width="25%" class="l-chat-box">
      <div class="l-chat-header">
        <el-input width="200px" placeholder="搜索" size="small">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div>
      <div class="l-chat-loadding" v-if="loading" v-loading="loading" element-loading-text="消息接收中..." element-loading-spinner="el-icon-loading" element-loading-background="#eee"></div>
      <el-scrollbar class="l-chat-list">
        <div v-for="(chat, index) in chatStore.chats" :key="index">
          <chat-session v-show="true" :chat="chat" :index="index" :active="index === chatStore.activeIndex" @click.native="handleActiveItem(index)" @delete="handleDelItem(index)" @top="handleTop(index)"></chat-session>
        </div>
      </el-scrollbar>
    </el-aside>
    <el-container class="r-chat-box">
      <chat-room v-show="activeChat.targetId > 0" :chat="activeChat"></chat-room>
    </el-container>
  </el-container>
</template>

<script>
import ChatSession from "../components/chat/ChatSession.vue";
import ChatRoom from "../components/chat/ChatRoom.vue";

export default {
  name: "chat",
  components: {
    ChatSession,
    ChatRoom,
  },
  data() {
    return {
      searchText: "",
      messageContent: "",
      group: {},
      groupMembers: [],
    };
  },
  methods: {
    handleActiveItem(index) {
      this.$store.commit("activeChat", index);
    },
    handleDelItem(index) {
      this.$store.commit("removeChat", index);
    },
    handleTop(chatIdx) {
      this.$store.commit("moveTop", chatIdx);
    },
  },
  computed: {
    chatStore() {
      return this.$store.state.chatStore;
    },
    activeChat() {
      let index = this.chatStore.activeIndex;
      let chats = this.chatStore.chats;
      if (index >= 0 && chats.length > 0) {
        return chats[index];
      }
      // 当没有激活任何会话时，创建一个空会话，不然控制台会有很多报错
      let emptyChat = {
        targetId: -1,
        showName: "",
        headImage: "",
        messages: [],
      };
      return emptyChat;
    },
    loading() {
      return this.chatStore.loadingGroupMsg || this.chatStore.loadingPrivateMsg;
    },
  },
};
</script>

<style lang="scss">
.el-container {
  .l-chat-box {
    display: flex;
    flex-direction: column;
    border-top: #dddddd solid 1px;
    border-bottom: #ddd solid 1px;
    background: white;
    width: 3rem;

    .l-chat-header {
      padding: 5px;
      background-color: white;
      line-height: 50px;
    }

    .l-chat-loadding {
      height: 50px;
      background-color: #eee;
    }
  }
}
</style>