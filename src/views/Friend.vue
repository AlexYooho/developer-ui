<template>
  <el-container class="friend-page">
    <el-aside width="260px" class="friend-list-box">
      <div class="friend-list-header">
        <div class="friend-list-search">
          <el-input width="200px" placeholder="搜索好友" v-model="searchText" size="small">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </div>
        <el-button plain icon="el-icon-plus" style="border: none; padding:12px; font-size: 20px;color: black;"
          title="添加好友" @click="onShowAddFriend()"></el-button>
        <add-friend :dialogVisible="showAddFriend" @close="onCloseAddFriend()"></add-friend>
      </div>

      <div class="friend-list-new" style="display: flex;flex-direction: column;">
        <div class="friend-new-title" style="display: flex;flex-direction: row;margin: 6px 0 10px 12px;size: 12px;">
          <label style="font-size: 12px;color: gray;">新朋友</label>
        </div>
        <div class="friend-new-content" style="display: flex;flex-direction: row;margin-left: 10px;" @click="onShowNewFriendList()">
          <img src="../../public/logo.png">
          <div style="margin: 10px;">新的朋友</div>
          <div v-show="addFriendCount > 0" class="unread-text">{{ addFriendCount }}</div>
        </div>
        <new-friend-list ref="newfriendlist" :dialogVisible="showNewFriendList" @close="onCloseNewFriendList()"></new-friend-list>
      </div>

      <el-divider content-position="center" style="margin: 10px;"></el-divider>
      <el-scrollbar class="friend-list-items">
        <div v-for="(friend, index) in $store.state.friendStore.friends" :key="index">
          <friend-item v-show="friend.nickName.startsWith(searchText)" :index="index"
            :active="index === $store.state.friendStore.activeIndex" @chat="onSendMessage(friend)"
            @delete="onDelItem(friend, index)" @click.native="onActiveItem(friend, index)">
          </friend-item>
        </div>
      </el-scrollbar>
    </el-aside>
    <el-container class="friend-box">
      <div class="friend-header" v-show="userInfo.id">
        {{ userInfo.nickname }}
      </div>
      <div v-show="userInfo.id">
        <div class="friend-detail">
          <!-- 头像，账号信息 -->
          <div class="friend-info">
            <div class="headimage">
              <head-image :size="60" :name="userInfo.nickname" :url="userInfo.headImage"
                @click.native="showFullImage()"></head-image>
            </div>
            &nbsp;&nbsp;&nbsp;
            <div class="info">
              <label>用户名：<span>{{ userInfo.username }}</span></label><br />
              <label>昵 称：<span>&nbsp;&nbsp;{{ userInfo.nickname }}</span></label><br />
              <label>性别：<span>&nbsp;&nbsp;&nbsp;{{ userInfo.sex == 0 ? "男" : "女" }}</span></label>
            </div>
          </div>
          <el-divider content-position="center"></el-divider>
          <!-- 备注 -->
          <div class="friend-info">
            <div>
              <label>备注：<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;备注</span></label><br />
              <label>标签：<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;朋友</span></label><br />
              <label>朋友权限：<span>所有</span></label>
            </div>
          </div>
          <el-divider content-position="center"></el-divider>
          <!-- 签名 -->
          <div class="friend-info">
            <label>签名：<span>{{ userInfo.signature }}</span></label><br />
          </div>
          <el-divider content-position="center"></el-divider>
          <!-- 按钮 -->
          <div class="friend-button">
            <el-button v-show="isFriend" icon="el-icon-chat-dot-round" type="primary"
              @click="onSendMessage(userInfo)">发送消息</el-button>
            <el-button v-show="!isFriend" icon="el-icon-plus" type="primary"
              @click="onAddFriend(userInfo)">加为好友</el-button>
            <el-button v-show="isFriend" icon="el-icon-delete" type="danger"
              @click="onDelItem(userInfo, friendStore.activeIndex)">删除好友</el-button>
          </div>
        </div>
      </div>
    </el-container>
  </el-container>
</template>
<script>
import HeadImage from '../components/common/HeadImage.vue';
import FriendItem from '../components/friend/FriendItem.vue';
import AddFriend from '../components/friend/AddFriend.vue';
import NewFriendList from '../components/friend/NewFriendList.vue'

export default {
  name: "friend",
  components: {
    FriendItem,
    AddFriend,
    HeadImage,
    NewFriendList
  },
  data() {
    return {
      searchText: "",
      showAddFriend: false,
      userInfo: {},
      showNewFriendList:false
    }
  },
  methods: {
    onShowAddFriend() {
      this.showAddFriend = true;
    },
    onCloseAddFriend() {
      this.showAddFriend = false;
    },
    onShowNewFriendList() {
      this.$refs.newfriendlist.loadNewFriendList();
      this.showNewFriendList = true;
    },
    onCloseNewFriendList() {
      this.showNewFriendList = false;
    },
    onActiveItem(friend, index) {
      this.$store.commit("activeFriend", index);
      this.loadUserInfo(friend, index);
    },
    onDelItem(friend, index) {
      this.$confirm(`确认要解除与 '${friend.nickName}'的好友关系吗?`, '确认解除?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

      })
    },
    onAddFriend(user) {

    },
    onSendMessage(user) {
      let chat = {
        type: 'PRIVATE',
        targetId: user.id,
        showName: user.nickName,
        headImage: user.headImage,
      };
      this.$store.commit("openChat", chat);
      this.$store.commit("activeChat", 0);
      this.$router.push("/home/chat");
    },
    showFullImage() {

    },
    updateFriendInfo(friend, user, index) {

    },
    loadUserInfo(friend, index) {
      this.$api.findUserInfo(friend.id).then((user) => {
        this.userInfo = user;
        // 如果发现好友的头像和昵称改了，进行更新
        if (user.headImageThumb != friend.headImage ||
          user.nickname != friend.nickname) {
          this.updateFriendInfo(friend, user, index)
        }
      });
    }
  },
  computed: {
    friendStore() {
      return this.$store.state.friendStore;
    },
    isFriend() {
      return this.friendStore.friends.find((f) => f.id == this.userInfo.id);
    },
    addFriendCount() {
      let addfriendCount = this.$store.state.friendStore.newFriendRequestCount;
      return addfriendCount;
    }
  },
  mounted() {
    if (this.friendStore.activeIndex >= 0) {
      let friend = this.friendStore.friends[this.friendStore.activeIndex];
      this.loadUserInfo(friend, this.friendStore.activeIndex);
    }
  }

}
</script>

<style scoped lang="scss">
.friend-page {
  .friend-list-box {
    display: flex;
    flex-direction: column;
    border: #dddddd solid 1px;
    background: white;

    .friend-list-header {
      height: 50px;
      display: flex;
      align-items: center;
      padding: 5px;
      background-color: white;

      .friend-list-search {
        flex: 1;
      }
    }

    .friend-list-items {
      flex: 1;
    }
  }

  .friend-box {
    display: flex;
    flex-direction: column;
    border: #dddddd solid 0.5px;

    .friend-header {
      height: 60px;
      padding: 0;
      margin: 0;
      line-height: 60px;
      font-size: 20px;
      text-align: left;
      text-indent: 10px;
      font-weight: 600;
      background-color: white;
      border-radius: 0 10px 0 0;
    }

    .friend-detail {
      display: flex;
      padding: 50px 100px 20px 100px;
      text-align: center;
      flex-direction: column;
      justify-content: left;

      .friend-info {
        display: flex;
        flex-direction: row;
        justify-content: left;
      }
    }
  }

  .friend-new-content{
    &:hover {
      background-color: #eeeeee;
    }
  }

  .unread-text {
    position: absolute;
    line-height: 15px;
    background-color: #f56c6c;
    left: 280px;
    top: 110px;
    color: white;
    border-radius: 10px;
    padding: 0 5px;
    font-size: 9px;
    text-align: center;
    white-space: nowrap;
    border: 1px solid #f1e5e5;
  }
}
</style>