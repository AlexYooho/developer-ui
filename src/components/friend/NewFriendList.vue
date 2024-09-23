<template>
    <el-dialog title="新的朋友" :visible.sync="dialogVisible" width="30%" :before-close="onClose">
        <el-scrollbar style="height:400px">
            <div v-for="(user) in newFriendList" :key="user.id" >
                <div class="item">
                    <div class="avatar">
                        <head-image :name="user.userName" :url="user.headImg" :online="user.online"></head-image>
                    </div>
                    <div class="add-friend-text">
                        <div class="text-user-name">
                            <div>{{ user.userName }}</div>
                        </div>
                        <div class="text-nick-name">
                            <div>{{ user.remark }}</div>
                        </div>
                    </div>
                    <el-button type="success" size="small" plain @click="onAccept(user)">接受</el-button>
                    <el-button type="danger" size="small" plain @click="onReject(user)">拒绝</el-button>
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
            newFriendList: [],
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
        onAccept(user) {
            let vo = {
                friendId:user.userId,
                isAgree:true
            };
            this.$api.processFriendRequest(vo).then((data)=>{
                console.log(data)
            })
        },
        onReject(user) {
            let vo = {
                friendId:user.userId,
                isAgree:false
            };
            this.$api.processFriendRequest(vo).then((data)=>{
                console.log(data)
            })
        },
        isFriend(userId) {
            let friends = this.$store.state.friendStore.friends;
            let friend = friends.find((f) => f.id == userId);
            return friend != undefined;
        },
        loadNewFriendList() {
            this.$api.getNewFriendList().then((data)=>{
                this.newFriendList=data;
            })
        }
    },
    mounted() {
        this.loadNewFriendList();
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