<template>
    <el-dialog class="login" title="注册" :visible.sync="visible" width="500px" :before-close="handleClose">
        <el-form :model="userInfo" label-width="80px" ref="settingForm">
            <el-form-item prop="nickName" label="账号">
                <el-input v-model="userInfo.account" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item prop="nickName" label="昵称">
                <el-input v-model="userInfo.nickname" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item prop="nickName" label="性别">
                <el-radio-group v-model="userInfo.sex">
                    <el-radio :label="0">男</el-radio>
                    <el-radio :label="1">女</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item prop="nickName" label="密码">
                <el-input v-model="userInfo.password" autocomplete="off" type="password" show-password></el-input>
            </el-form-item>
            <el-form-item prop="nickName" label="确认密码">
                <el-input v-model="userInfo.confirmPassword" autocomplete="off" type="password" show-password></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="handleClose()">取 消</el-button>
            <el-button type="primary" @click="handleSubmit()">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
export default {
    name: "register",
    data() {
        return {
            userInfo: {}
        };
    },
    methods: {
        handleClose() {
            this.$emit("close");
        },
        handleSubmit() {
            if (this.userInfo.password != this.userInfo.confirmPassword) {
                this.$message.error("密码不一致,请确认");
                return;
            }
            this.$api.register(this.userInfo).then((res) => {
                this.$emit("close");
                this.$message.success("注册成功");
                this.$emit("openLogin");
            });
        }
    },
    props: {
        visible: {
            type: Boolean,
        },
    },
    watch: {
        visible: function (newData, oldData) {
            let mine = this.$store.state.userStore.userInfo;
            this.userInfo = JSON.parse(JSON.stringify(mine));
            console.log(this.userInfo);
        },
    },
};
</script>