<template>
    <el-dialog title="添加好友" :visible.sync="dialogVisible" width="30%" :before-close="onClose">
        <el-input placeholder="输入用户名或昵称,最多展示20条" class="input-with-select" v-model="searchText"
            @keyup.enter.native="onSearch()">
            <el-button slot="append" icon="el-icon-search" @click="onSearch()"></el-button>
        </el-input>
        <el-scrollbar style="height:400px">
            <div v-for="(user) in users" :key="user.id" >
                <div class="item">
                    <div class="avatar">
                        <head-image :name="user.nickname" :url="user.headImage" :online="user.online"></head-image>
                    </div>
                    <div class="add-friend-text">
                        <div class="text-user-name">
                            <div>{{ user.username }}</div>
                            <div :class="user.online ? 'online-status online' : 'online-status'">{{ user.online ? "[在线]" :
                                "[离线]" }}
                            </div>
                        </div>
                        <div class="text-nick-name">
                            <div>昵称：{{ user.nickname }}</div>
                        </div>
                    </div>
                    <el-button type="success" size="small" v-show="!isFriend(user.id)" plain
                        @click="onAddFriend(user)">添加</el-button>
                    <el-button type="info" size="small" v-show="isFriend(user.id)" plain disabled>已添加</el-button>
                </div>
            </div>
        </el-scrollbar>
    </el-dialog>
</template>

<script>
import HeadImage from '../common/HeadImage.vue';

export default {
    name: "addFriend",
    components: {
        HeadImage
    },
    data() {
        return {
            users: [],
            searchText: ""
        }
    },
    props: {
        dialogVisible: {
            type: Boolean
        }
    },
    methods: {
        onClose() {
            this.$emit("close");
        },
        onSearch() {
            this.$api.getUserInfoByName(this.searchText).then((data)=>{
                this.users=data;
            })
        },
        onAddFriend(user) {
            let vo = {
                friendId: user.id,
                remark : "加个好友呗，靓女",
                addChannel:0
            };
            this.$api.sendAddFriendRequest(vo).then((data)=>{
                this.$message.success("好友申请已发送，等待对方通过");
            })
        },
        isFriend(userId) {
            let friends = this.$store.state.friendStore.friends;
            let friend = friends.find((f) => f.id == userId);
            return friend != undefined;
        }
    }
}
</script>

<style  lang="scss">
.el-dialog {
    min-width: 400px;
}

.item {
    height: 65px;
    display: flex;
    position: relative;
    padding-left: 15px;
    align-items: center;
    padding-right: 25px;

    .add-friend-text {
        margin-left: 15px;
        flex: 3;
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        overflow: hidden;

        .text-user-name {
            display: flex;
            flex-direction: row;
            font-weight: 600;
            font-size: 16px;
            line-height: 25px;

            .online-status {
                font-size: 12px;
                font-weight: 600;

                &.online {
                    color: #5fb878;
                }
            }
        }

        .text-nick-name {
            display: flex;
            flex-direction: row;
            font-size: 12px;
            line-height: 20px;
        }

    }
}
</style>