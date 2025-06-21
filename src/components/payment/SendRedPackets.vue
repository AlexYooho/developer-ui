<template>
  <el-dialog class="red-packets" title="红包" :visible.sync="visible" width="400px" :before-close="handleClose">
    <el-form label-width="80px" ref="settingForm">
      <el-form-item prop="amount" label="金额">
        <el-input v-model="amount"></el-input>
      </el-form-item>
      <el-form-item label="红包类型" v-show="redPacketsType === 'Lucky'">
        <el-radio-group>
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
    }
  },
  data() {
    return {
        amount: 0
    };
  },
  methods: {
    handleClose() {
        this.visible = false;
        this.$emit("close");
    },
    handleSubmit() {
      // 提交逻辑
        this.visible = false;
        this.$emit("close");
    }
  }
};
</script>
