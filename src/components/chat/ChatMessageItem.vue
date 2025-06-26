<template>
  <div class="chat-msg-item">
    <div class="chat-msg-tip" v-show="msgInfo.messageStatus == $enums.MESSAGE_STATUS.RECALL">
      {{ msgInfo.messageContent }}
    </div>
    <div class="chat-msg-tip" v-show="msgInfo.messageContentType == $enums.MESSAGE_TYPE.TIP_TIME">
      {{ $date.toTimeText(msgInfo.sendTime) }}
    </div>
    <div class="chat-msg-normal" v-show="msgInfo.messageStatus != $enums.MESSAGE_STATUS.RECALL"
      :class="{ 'chat-msg-mine': mine }">
      <div class="head-image">
        <head-image :name="showName" :size="40" :url="headImage" :id="msgInfo.sendId"></head-image>
      </div>

      <div class="chat-msg-content">
        <div v-show="mode == 1 && msgInfo.groupId && !msgInfo.selfSend" class="chat-msg-top">
          <span>{{ showName }}</span>
        </div>
        <div v-show="mode == 2" class="chat-msg-top">
          <span>{{ showName }}</span>
          <span>{{ $date.toTimeText(msgInfo.sendTime) }}</span>
        </div>
        <div class="chat-msg-bottom" style="min-width: 60px; max-width: 300px;"
          @contextmenu.prevent="showRightMenu($event)">
          <!-- 文本 -->
          <span class="chat-msg-text" :style="{ 'text-align': msgInfo.messageContent.length == 1 ? 'center' : 'left' }"
            v-if="msgInfo.messageContentType == $enums.MESSAGE_TYPE.TEXT && msgInfo.messageStatus != $enums.MESSAGE_STATUS.RECALL"
            v-html="$emo.transform(msgInfo.messageContent)"></span>
          <!-- 图片 -->
          <div class="chat-msg-image" v-if="msgInfo.messageContentType == $enums.MESSAGE_TYPE.IMAGE">
            <div class="img-load-box" v-loading="loading" element-loading-text="上传中"
              element-loading-background="rgba(0,0,0,0.4)">
              <el-image style="width: 100px; height: 100px" :src="JSON.parse(msgInfo.messageContent).thumbUrl"
                :zoom-rate="1.2" :max-scale="7" :min-scale="0.2" :preview-src-list="previewImageList"
                :initial-index="initialIndex" fit="cover" @click="setInitialIndex(msgInfo.id)" />
            </div>
            <span title="发送失败" v-show="loadFail" @click="handleSendFail" class="send-fail el-icon-warning"></span>
          </div>
          <!-- 文件 -->
          <div class="chat-msg-file" v-if="msgInfo.messageContentType == $enums.MESSAGE_TYPE.FILE">
            <div class="chat-file-box" v-loading="loading">
              <div class="chat-file-info">
                <el-link class="chat-file-name" :underline="true" target="_blank" type="primary" :href="data.url">{{
                  data.name }}</el-link>
                <div class="chat-file-size">{{ fileSize }}</div>
              </div>
              <div class="chat-file-icon">
                <span type="primary" class="el-icon-document"></span>
              </div>
            </div>
            <span title="发送失败" v-show="loadFail" @click="handleSendFail" class="send-fail el-icon-warning"></span>
          </div>
          <!-- 语音 -->
          <!-- <div class="chat-msg-voice" v-if="msgInfo.messageContentType == $enums.MESSAGE_TYPE.AUDIO" @click="handlePlayVoice()">
            <audio controls :src="JSON.parse(msgInfo.messageContent).url"></audio>
          </div> -->
          <!-- 红包 -->
          <div class="chat-msg-red-packet" v-if="msgInfo.messageContentType == $enums.MESSAGE_TYPE.RED_PACKETS">
            <span class="red-packet-icon">🧧</span>
            <div class="red-packet-title">红包来咯</div>
            <div class="red-packet-desc">恭喜发财，大吉大利</div>
            <div class="red-packet-footer">
              <span class="red-packet-logo">￥</span>
              <span>收到红包</span>
            </div>
          </div>
          <!-- 已读未读状态 -->
          <span class="chat-readed"
            v-show="msgInfo.selfSend && !msgInfo.groupId && msgInfo.messageStatus == $enums.MESSAGE_STATUS.READED">已读</span>
          <span class="chat-unread"
            v-show="msgInfo.selfSend && !msgInfo.groupId && msgInfo.messageStatus != $enums.MESSAGE_STATUS.READED">未读</span>
          <span class="chat-unread" v-show="msgInfo.selfSend && msgInfo.groupId && msgInfo.unReadCount > 0">{{
            msgInfo.unReadCount }} 人未读</span>
        </div>
      </div>
    </div>
    <right-menu v-show="menu && rightMenu.show" :pos="rightMenu.pos" :items="menuItems" @close="rightMenu.show = false"
      @select="handleSelectMenu"></right-menu>
  </div>
</template>

<script>
import HeadImage from "../common/HeadImage.vue";
import RightMenu from "../common/RightMenu.vue";

export default {
  name: "messageItem",
  components: {
    HeadImage,
    RightMenu,
  },
  props: {
    mode: {
      type: Number,
      default: 1,
    },
    mine: {
      type: Boolean,
      required: true,
    },
    headImage: {
      type: String,
      required: true,
    },
    showName: {
      type: String,
      required: true,
    },
    msgInfo: {
      type: Object,
      required: true,
    },
    menu: {
      type: Boolean,
      default: true,
    },
    targetId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      audioPlayState: "STOP",
      initialIndex: 0,
      messageIdToIndex: [],
      rightMenu: {
        show: false,
        pos: {
          x: 0,
          y: 0,
        },
      },
    };
  },
  methods: {
    setInitialIndex(id) {
      let imageList = [];
      let index = 0;
      let userId = this.$store.state.userStore.userInfo.id;
      let key = "chats-" + userId;
      let item = JSON.parse(localStorage.getItem(key))
      let messages = item.chats.filter(x => x.targetId == this.targetId)[0].messages;
      for (let i = 1; i < messages.length; i++) {
        var message = messages[i];
        if (message.messageContentType == this.$enums.MESSAGE_TYPE.IMAGE) {
          imageList.push({
            messageid: message.id,
            indexs: index
          });
          index++;
        }
      }
      let imageIndex = imageList.filter(x => x.messageid == id)[0].indexs;
      this.initialIndex = imageIndex;
    },
    handleSendFail() {
      this.$message.error(
        "该文件已发送失败，目前不支持自动重新发送，建议手动重新发送"
      );
    },
    handlePlayVoice() {
      if (!this.audio) {
        this.audio = new Audio();
      }
      this.audio.src = JSON.parse(this.msgInfo.content).url;
      this.audio.play();
      this.handlePlayVoice = "RUNNING";
    },
    showRightMenu(e) {
      this.rightMenu.pos = {
        x: e.x,
        y: e.y,
      };
      this.rightMenu.show = "true";
    },
    handleSelectMenu(item) {
      this.$emit(item.key.toLowerCase(), this.msgInfo);
    },
  },
  computed: {
    loading() {
      debugger;
      return this.msgInfo.loadStatus && this.msgInfo.loadStatus === "loading";
    },
    loadFail() {
      return this.msgInfo.loadStatus && this.msgInfo.loadStatus === "fail";
    },
    data() {
      return JSON.parse(this.msgInfo.messageContent);
    },
    fileSize() {
      let size = this.data.size;
      if (size > 1024 * 1024) {
        return Math.round(size / 1024 / 1024) + "M";
      }
      if (size > 1024) {
        return Math.round(size / 1024) + "KB";
      }
      return size + "B";
    },
    menuItems() {
      let items = [];
      items.push({
        key: "DELETE",
        name: "删除",
        icon: "el-icon-delete",
      });
      if (this.msgInfo.selfSend && this.msgInfo.id > 0) {
        items.push({
          key: "RECALL",
          name: "撤回",
          icon: "el-icon-refresh-left",
        });
      }
      return items;
    },
    previewImageList() {
      let imageList = [];
      let userId = this.$store.state.userStore.userInfo.id;
      let key = "chats-" + userId;
      let item = JSON.parse(localStorage.getItem(key))
      let messages = item.chats.filter(x => x.targetId == this.targetId)[0].messages;
      for (let i = 1; i < messages.length; i++) {
        var message = messages[i];
        if (message.messageContentType == this.$enums.MESSAGE_TYPE.IMAGE) {
          var temp = JSON.parse(message.messageContent)
          imageList.push(temp.originUrl);
        }
      }
      return imageList;
    }
  },
};
</script>

<style scoped lang="scss">
.chat-msg-item {
  .chat-msg-tip {
    line-height: 50px;
    font-size: 14px;
  }

  .chat-msg-normal {
    position: relative;
    font-size: 0;
    padding-left: 60px;
    min-height: 50px;
    margin-top: 10px;

    .head-image {
      position: absolute;
      width: 40px;
      height: 40px;
      top: 0;
      left: 0;
    }

    .chat-msg-content {
      text-align: left;

      .send-fail {
        color: #e60c0c;
        font-size: 30px;
        cursor: pointer;
        margin: 0 20px;
      }

      .chat-msg-top {
        display: flex;
        flex-wrap: nowrap;
        color: #333;
        font-size: 14px;
        line-height: 20px;

        span {
          margin-right: 12px;
        }
      }

      .chat-msg-bottom {
        display: inline-block;
        padding-right: 80px;

        .chat-msg-text {
          text-align: center;
          display: block;
          position: relative;
          line-height: 20px;
          margin-top: 3px;
          padding: 7px;
          background-color: #ffffff;
          border-radius: 5px;
          color: black;
          display: block;
          font-size: 14px;
          text-align: left;
          white-space: pre-wrap;
          word-break: break-all;
          box-shadow: 1px 1px 1px #ddd;

          &:after {
            content: "";
            position: absolute;
            left: -10px;
            top: 13px;
            width: 0;
            height: 0;
            border-style: solid dashed dashed;
            border-color: #ffffff transparent transparent;
            overflow: hidden;
            border-width: 10px;
            border-top-color: #ffffff;
          }
        }

        .chat-msg-image {
          display: flex;
          flex-wrap: nowrap;
          flex-direction: row;
          align-items: center;

          .send-image {
            min-width: 200px;
            min-height: 150px;
            max-width: 400px;
            max-height: 300px;
            border: #dddddd solid 1px;
            border: 5px solid #ccc;
            border-radius: 6px;
            cursor: pointer;
          }
        }

        .chat-msg-file {
          display: flex;
          flex-wrap: nowrap;
          flex-direction: row;
          align-items: center;
          cursor: pointer;

          .chat-file-box {
            display: flex;
            flex-wrap: nowrap;
            align-items: center;
            min-height: 80px;
            box-shadow: 1px 1px 1px #ddd;
            border: #dddddd solid 1px;
            border-radius: 6px;
            background-color: #fff;
            padding: 10px 15px;

            .chat-file-info {
              flex: 1;
              height: 100%;
              text-align: left;
              font-size: 14px;

              .chat-file-name {
                display: inline-block;
                min-width: 150px;
                max-width: 300px;
                font-size: 15px;
                font-weight: 600;
                margin-bottom: 15px;
                white-space: pre-wrap;
                word-break: break-all;
                color: black
              }
            }

            .chat-file-icon {
              font-size: 40px;
              color: #fa9d3b;
            }
          }

          .send-fail {
            color: #e60c0c;
            font-size: 30px;
            cursor: pointer;
            margin: 0 20px;
          }
        }

        .chat-msg-voice {
          font-size: 14px;
          cursor: pointer;

          audio {
            height: 45px;
            padding: 5px 0;
          }
        }

        .chat-unread {
          font-size: 10px;
          color: #f23c0f;
          font-weight: 600;
        }

        .chat-readed {
          font-size: 10px;
          color: #888;
          font-weight: 600;
        }
      }
    }

    &.chat-msg-mine {
      text-align: right;
      padding-left: 0;
      padding-right: 60px;

      .head-image {
        left: auto;
        right: 0;
      }

      .chat-msg-content {
        text-align: right;

        .chat-msg-top {
          flex-direction: row-reverse;

          span {
            margin-left: 12px;
            margin-right: 0;
          }
        }

        .chat-msg-bottom {
          padding-left: 80px;
          padding-right: 0;

          .chat-msg-text {
            text-align: left;
            margin-left: 10px;
            background-color: #95ec69;
            color: black;
            vertical-align: top;
            box-shadow: 1px 1px 1px #ddd;

            &:after {
              left: auto;
              right: -10px;
              border-top-color: #95ec69;
            }
          }

          .chat-msg-image {
            flex-direction: row-reverse;
          }

          .chat-msg-file {
            flex-direction: row-reverse;
          }
        }
      }
    }
  }
}

.chat-msg-red-packet {
  width: 220px;
  min-height: 70px;
  background: linear-gradient(135deg, #fa5151 80%, #fca652 100%);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(250, 81, 81, 0.10);
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 16px 20px 12px 20px;
  position: relative;
  overflow: hidden;
  font-family: 'PingFang SC', 'Microsoft YaHei', Arial, sans-serif;
}

.chat-msg-red-packet .red-packet-icon {
  position: absolute;
  left: 20px;
  bottom: 50px;
  font-size: 32px;
  opacity: 0.15;
  pointer-events: none;
  z-index: 0;
}

.chat-msg-red-packet .red-packet-title,
.chat-msg-red-packet .red-packet-desc,
.chat-msg-red-packet .red-packet-footer {
  position: relative;
  z-index: 1;
}

.chat-msg-red-packet .red-packet-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 6px;
  letter-spacing: 1px;
}

.chat-msg-red-packet .red-packet-desc {
  font-size: 14px;
  opacity: 0.85;
}

.chat-msg-red-packet .red-packet-footer {
  margin-top: 10px;
  font-size: 12px;
  opacity: 0.7;
  display: flex;
  align-items: center;
}

.chat-msg-red-packet .red-packet-footer .red-packet-logo {
  width: 18px;
  height: 18px;
  margin-right: 6px;
  border-radius: 50%;
  background: #fff3e0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fa5151;
  font-size: 14px;
}
</style>