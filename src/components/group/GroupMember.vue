<template>
  <div class="group-member">
    <head-image
      :id="member.userId"
      :name="member.aliasName"
      :url="member.headImage"
      :size="50"
      :online="member.online"
    >
      <div
        v-if="showDel"
        @click.stop="onDelete()"
        class="btn-kick el-icon-error"
      ></div>
    </head-image>
    <div class="memeber-name">{{ member.aliasName }}</div>
  </div>
</template>

<script>
import HeadImage from "../common/HeadImage.vue";

export default {
  name: "groupMember",
  components: {
    HeadImage,
  },
  props: {
    member: {
      type: Object,
      required: true,
    },
    showDel: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onDelete() {
      this.$emit("del", this.member);
    },
  },
};
</script>

<style lang="scss">
.group-member {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50px;
  .member-name {
    font-size: 12px;
    text-align: center;
    width: 100%;
    height: 30px;
    line-height: 30px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .btn-kick {
    display: none;
    position: absolute;
    right: -8px;
    top: -8px;
    color: darkred;
    font-size: 20px;
    cursor: pointer;
  }

  &:hover .btn-kick {
    display: block;
    color: #ce1818;
  }
}
</style>
