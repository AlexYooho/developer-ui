<template>
  <el-dialog class="red-packets" title="红包" :visible.sync="visible" width="400px" :before-close="handleClose">
    <el-form label-width="80px" ref="settingForm">
      <el-form-item prop="amount" label="金额">
        <el-input v-model="amount" type="number"></el-input>
      </el-form-item>
      <el-form-item prop="pwd" label="支付密码">
        <el-input v-model="pwd"></el-input>
      </el-form-item>
      <el-form-item label="红包类型" v-show="redPacketsType === 'Lucky'">
        <el-radio-group v-model="type">
          <el-radio :label="0">普通</el-radio>
          <el-radio :label="1">手气</el-radio>
        </el-radio-group>
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
  name: "send-red-packets",
  props: {
    visible: {
      type: Boolean,
    },
    redPacketsType: {
      type: String,
      default: "Normal"
    },
    targetId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
        amount: 0,
        pwd: "",
        type: 0, // 0: 普通红包, 1: 手气红包
    };
  },
  methods: {
    handleClose() {
        this.visible = false;
        this.$emit("close");
    },
    handleSubmit() {
        // 发红包逻辑
        this.$api.sendRedPacket(this.amount, this.targetId,1,this.type,0).then((res) => {
                // 发送红包成功
                this.visible = false;
                this.$emit("success",res.id);
            })
            .catch((error) => {
                // 处理发送失败
                this.$emit("failure");
            });
    }
  }
};
</script>
