<template>
  <div class="chatBox">
    <el-container>
      <!-- 右边菜单栏 -->
      <el-aside width="55px" class="navi-bar">
        <div class="user-head-image" style="padding-left: 7px">
          <head-image :name="$store.state.userStore.userInfo.nickname"
            :url="$store.state.userStore.userInfo.headImageThumb" :size="40" @click.native="showSettingDialog = true">
          </head-image>
        </div>

        <el-menu background-color="#333333" text-color="#ddd">
          <el-menu-item title="聊天">
            <router-link v-bind:to="'/home/chat'">
              <span class="el-icon-chat-dot-round"></span>
              <div v-show="unreadCount > 0" class="unread-text">{{ unreadCount }}</div>
            </router-link>
          </el-menu-item>
          <el-menu-item title="好友">
            <router-link v-bind:to="'/home/friend'">
              <span class="el-icon-user"></span>
              <div v-show="addFriendCount > 0" class="unread-text">{{ addFriendCount }}</div>
            </router-link>
          </el-menu-item>
          <el-menu-item title="群组">
            <router-link v-bind:to="'/home/group'">
              <span class="icon iconfont icon-group_fill"></span>
            </router-link>
          </el-menu-item>
          <el-menu-item title="朋友圈">
            <span class="el-icon-orange"></span>
          </el-menu-item>
          <el-menu-item title="设置" @click="showSetting()">
            <span class="el-icon-setting"></span>
          </el-menu-item>
          <el-menu-item title="开关软件" @click="showLogin()">
            <span class="el-icon-switch-button"></span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- 左边聊天内容栏 -->
      <el-main class="content-box">
        <router-view></router-view>
      </el-main>

      <!-- 组件 -->
      <!-- 设置 -->
      <setting :visible="showSettingDialog" @close="closeSetting()"></setting>

      <!-- 用户信息展示 -->
      <user-info v-show="uiStore.userInfo.show" :pos="uiStore.userInfo.pos" :user="uiStore.userInfo.user"
        @close="$store.commit('closeUserInfoBox')"></user-info>

      <!-- 登录 -->
      <login :visible="showLoginDialog" @close="closeLogin()" @openRegister="showRegister()" @init="init()"></login>

      <!-- 注册 -->
      <register :visible="showRegisterDialog" @close="closeRegister()" @openLogin="showLogin()"></register>
    </el-container>
  </div>
</template>


<script>
import HeadImage from "../components/common/HeadImage.vue";
import Setting from "../components/common/Setting.vue";
import UserInfo from "../components/common/UserInfo.vue";
import Login from "../components/common/Login.vue"
import Register from "../components/common/Register.vue";

export default {
  components: {
    HeadImage,
    Setting,
    UserInfo,
    Login,
    Register
  },

  data() {
    return {
      showSettingDialog: false,
      lastPlayAudioTime: new Date() - 1000,
      showLoginDialog: false,
      showRegisterDialog: false
    };
  },

  methods: {
    // 初始化
    init() {
      this.$store
        .dispatch("load")
        .then(() => {
          // 加载会话列表
          this.loadPrivateMessage(this.$store.state.chatStore.privateMsgMaxId);
          this.loadGroupMessage(this.$store.state.chatStore.groupMsgMaxId);
          this.$wsApi.connect(
            "ws://localhost:8867/im",
            sessionStorage.getItem("accessToken")
          );
          this.$wsApi.onMessage((cmd, msgInfo) => {
            if (cmd == 2) { // 强制下线
              this.$wsApi.close(3000);
              this.$alert("您已在其他地方登陆，将被强制下线", "强制下线通知", {
                confirmButtonText: "确定",
                callback: (action) => {
                  this.showLogin();
                },
              });
            } else if (cmd == 3) { // 私聊
              this.handlePrivateMessage(msgInfo);
            } else if (cmd == 4) { // 群聊
              this.handleGroupMessage(msgInfo);
            } else if (cmd == 5) { // 系统消息
              this.handleSystemMessage(msgInfo);
            } else if (cmd == 6) { // 订阅消息
              this.handleSubMessage(msgInfo);
            }
          });
          this.$wsApi.onClose((e) => {
            console.log(e);
            if (e.code != 3000) {
              // 断线重连
              this.$message.error("连接断开，正在尝试重新连接...");
              this.$wsApi.reconnect(
                process.env.VUE_APP_WS_URL,
                sessionStorage.getItem("accessToken")
              );
            }
          });
        })
        .catch((e) => {
          console.log("初始化失败", e);
        });
    },

    // 私聊消息处理
    loadPrivateMessage(minId) {
      this.$store.commit("loadingPrivateMsg", true);
      this.$api.getPrivateMessageList(minId).then((msgInfos) => {
        if (msgInfos == null) {
          this.$store.commit("loadingPrivateMsg", false);
          return;
        }
        
        msgInfos.forEach((msgInfo) => {
          msgInfo.selfSend =
            msgInfo.sendId == this.$store.state.userStore.userInfo.id;
          let friendId = msgInfo.selfSend ? msgInfo.receiverId : msgInfo.sendId;
          let friend = this.$store.state.friendStore.friends.find(
            (f) => f.id == friendId
          );
          if (friend) {
            this.insertPrivateMessage(friend, msgInfo);
          }
        });

        if (msgInfos.length == 100) {
          this.loadPrivateMessage(msgInfos[99].id);
        } else {
          this.$store.commit("loadingPrivateMsg", false);
        }
      });
    },
    insertPrivateMessage(friend, msg) {
      if (
        msg.type >= this.$enums.MESSAGE_TYPE.RTC_CALL &&
        msg.type <= this.$enums.MESSAGE_TYPE.RTC.CANDIDATE
      ) {
        if (
          msg.type == this.$enums.MESSAGE_TYPE.RTC_CALL ||
          msg.type == this.$enums.MESSAGE_TYPE.RTC_CANCEL
        ) {
          this.$store.commit("showVideoAcceptorBox", friend);
          this.$refs.videoAcceptor.handleMessage(msg);
        } else {
          this.$refs.videoAcceptor.close();
          this.$refs.privateVideo.handleMessage(msg);
        }

        return;
      }

      let chatInfo = {
        type: "PRIVATE",
        targetId: friend.id,
        showName: friend.nickName,
        headImage: friend.headImage,
      };
      // 打开会话
      this.$store.commit("openChat", chatInfo);
      // 插入消息
      this.$store.commit("insertMessage", msg);
      // 播放提示音
      if (!msg.selfSend && msg.status != this.$enums.MESSAGE_STATUS.READED) {
        this.playAudioTip();
      }
    },
    handlePrivateMessage(msg) {
      msg.selfSend = msg.sendId == this.$store.state.userStore.userInfo.id;
      let friendId = msg.selfSend ? msg.recvId : msg.sendId;
      if (msg.messageStatus == this.$enums.MESSAGE_STATUS.READED) {
        if (msg.selfSend) {
          let chatInfo = {
            type: "PRIVATE",
            targetId: friendId,
          };
          this.$store.commit("resetUnreadCount", chatInfo);
        } else {
          this.$store.commit("readedMessage", friendId);
        }
        return;
      }
      this.loadFriendInfo(friendId).then((friend) => {
        this.insertPrivateMessage(friend, msg);
      });
    },
    loadFriendInfo(id) {
      return new Promise((resolve, reject) => {
        let friend = this.$store.state.friendStore.friends.find(
          (f) => f.id == id
        );
        if (friend) {
          resolve(friend);
        } else {
          this.$api.findFriedById(id).then((friend) => {
            this.$store.commit("addFriend", friend);
            resolve(friend);
          });
        }
      });
    },

    // 群聊消息处理
    loadGroupMessage(minId) {
      this.$store.commit("loadingGroupMsg", true);
      this.$api.getGroupMessageList(minId).then((msgInfos) => {
        if (msgInfos == null) {
          this.$store.commit("loadingPrivateMsg", false);
          return;
        }
        msgInfos.forEach((msgInfo) => {
          msgInfo.selfSend =
            msgInfo.sendId == this.$store.state.userStore.userInfo.id;
          let groupId = msgInfo.groupId;
          let group = this.$store.state.groupStore.groups.find(
            (g) => g.id == groupId
          );
          if (group) {
            this.insertGroupMessage(group, msgInfo);
          }
        });

        if (msgInfos.length == 100) {
          // 继续拉取
          this.loadGroupMessage(msgInfos[99].id);
        } else {
          this.$store.commit("loadingGroupMsg", false);
        }
      });
    },
    insertGroupMessage(group, msg) {
      let chatInfo = {
        type: "GROUP",
        targetId: group.id,
        showName: group.name,
        headImage: group.headImageThumb,
      };
      // 打开会话
      this.$store.commit("openChat", chatInfo);
      // 插入消息
      this.$store.commit("insertMessage", msg);
      // 播放提示音
      if (!msg.selfSend && msg.status != this.$enums.MESSAGE_STATUS.READED) {
        this.playAudioTip();
      }
    },
    handleGroupMessage(msg) {
      msg.selfSend = msg.sendId == this.$store.state.userStore.userInfo.id;
      let groupId = msg.groupId;
      if (msg.messageStatus == this.$enums.MESSAGE_STATUS.READED) {
        let chatInfo = {
          type: "GROUP",
          targetId: groupId,
          messageId: msg.id,
          messageStatus:msg.messageStatus
        };
        this.$store.commit("resetUnreadCount", chatInfo);
        return;
      }
      this.loadGroupInfo(groupId).then((group) => {
        this.insertGroupMessage(group, msg);
      });
    },
    loadGroupInfo(id) {
      return new Promise((resolve, reject) => {
        let group = this.$store.state.groupStore.groups.find((g) => g.id == id);
        if (group) {
          resolve(group);
        } else {
          this.$api.getGroup(id).then((group) => {
            resolve(group);
            this.$store.commit("addGroup", group);
          });
        }
      });
    },

    // 系统消息处理
    handleSystemMessage(msg){
      this.$store.state.friendStore.newFriendRequestCount++;
    },

    // 订阅消息处理
    handleSubMessage(msg){},

    // 退出
    onExit() {
      this.$wsApi.close(3000);
      sessionStorage.removeItem("accessToken");
      location.href = "/";
      this.$message.success("退出登录");
    },

    // 打开设置窗口
    showSetting() {
      this.showSettingDialog = true;
    },

    // 关闭设置窗口
    closeSetting() {
      this.showSettingDialog = false;
    },

    // 打开登录窗口
    showLogin() {
      let token = sessionStorage.getItem("accessToken");
      if (token == "" || token == null) {
        this.showLoginDialog = true;
      } else {
        this.onExit();
      }
    },

    // 关闭登录窗口
    closeLogin() {
      this.showLoginDialog = false;
    },

    // 打开注册窗口
    showRegister() {
      this.showRegisterDialog = true;
    },

    // 关闭注册窗口
    closeRegister() {
      this.showRegisterDialog = false;
    },

    // 播放消息提示音
    playAudioTip() {
      if (new Date() - this.lastPlayAudioTime > 1000) {
        this.lastPlayAudioTime = new Date();
        let audio = new Audio();
        let url = require(`@/assets/audio/tip.wav`);
        audio.src = url;
        audio.play();
      }
    },
  },

  computed: {
    uiStore() {
      return this.$store.state.uiStore;
    },
    unreadCount() {
      let unreadCount = 0;
      let chats = this.$store.state.chatStore.chats;
      chats.forEach((chat) => {
        unreadCount += chat.unreadCount;
      });
      return unreadCount;
    },
    addFriendCount() {
      let addfriendCount = this.$store.state.friendStore.newFriendRequestCount;
      return addfriendCount;
    }
  },

  watch: {
    unreadCount: {
      handler(newCount, oldCount) {
        let tip = newCount > 0 ? `${newCount}条未读` : "";
        this.$elm.setTitleTip(tip);
      },
      immediate: true,
    },
  },

  mounted() {
    var token = sessionStorage.getItem("accessToken");
    if (token == "" || token == null) {
      this.$router.push("/home");
      this.showLogin();
      return;
    }
    this.init();
  },

  unmounted() {
    this.$wsApi.close();
  },
};
</script>

<style scoped lang="scss">
.chatBox {
  position: absolute;
  top: 15%;
  bottom: 15%;
  left: 20%;
  right: 20%;

  .navi-bar {
    background: #333333;
    padding: 0;
    padding-top: 50px;

    .el-menu {
      border: none;
      flex: 1;

      .el-menu-item {
        padding-left: 15px !important;

        .router-link-exact-active span {
          color: white !important;
        }

        span {
          font-size: 24px !important;
          color: #aaaaaa;

          &:hover {
            color: white !important;
          }
        }

        .unread-text {
          position: absolute;
          line-height: 15px;
          background-color: #f56c6c;
          left: 30px;
          top: 12px;
          color: white;
          border-radius: 10px;
          padding: 0 5px;
          font-size: 9px;
          text-align: center;
          white-space: nowrap;
          border: 1px solid #f1e5e5;
        }
      }
    }

    .exit-box {
      position: absolute;
      width: 60px;
      bottom: 40px;
      color: #aaaaaa;
      font-size: 24px;
      text-align: center;
      cursor: pointer;

      &:hover {
        color: white !important;
      }
    }
  }

  .content-box {
    padding: 0;
    background-color: #e9eef3;
    color: #333;
    text-align: center;
  }

  .el-aside {
    border-radius: 10px 0px 0px 10px;
  }

  .el-main {
    border-radius: 0px 10px 10px 0px;
  }
}
</style>
 