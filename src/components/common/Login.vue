<template>
  <el-dialog class="login" title="登录" :visible.sync="visible" width="500px" :before-close="handleClose">
    <el-form :model="userInfo" label-width="80px" :rules="rules" ref="settingForm">
      <el-form-item prop="nickName" label="账号">
        <el-input v-model="userInfo.account" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item prop="nickName" label="密码">
        <el-input v-model="userInfo.password" autocomplete="off" type="password" show-password></el-input>
      </el-form-item>
    </el-form>
    <div class="register">
      <span @click="goRegister()">没有账号,去注册</span>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose()">取 消</el-button>
      <el-button type="primary" @click="handleSubmit()">确 定</el-button>
    </span>
  </el-dialog>
</template>
  
<script>
export default {
  name: "login",
  data() {
    return {
      userInfo: {},
      rules: {
        account: [
          {
            required: true,
            message: "请输入昵称",
            tigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            tigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    handleClose() {
      this.$emit("close");
    },
    handleSubmit() {
      let dto = {
        account:this.userInfo.account,
        password:this.userInfo.password
      };
      
      this.$api.login(dto).then((res) => {
        sessionStorage.setItem("accessToken", res.access_token);
        this.$router.push("/home/chat");
        this.$emit("init");
        this.$emit("close");
        debugger
        this.$message.success("登录成功");
      });
    },
    goRegister(){
      this.$emit("close");
      this.$emit("openRegister");
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

<style>
.register {
  display: flex;
  justify-content: flex-end;
  margin-right: 10px;
}
</style>