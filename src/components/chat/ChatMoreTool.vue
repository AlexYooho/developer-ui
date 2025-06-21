<template>
	<div  v-show="show" @click="close()">
		<div class="chat-tool-box" :style="{'left':x+'px','top':y+'px'}">
			<el-scrollbar style="height:250px">
				<div class="chat-tool-item-list">
                    <div class="chat-more-tool-item" v-for="tool in $chatToolBar.tools" :key="tool.name" @click="onClickTool(tool.action)">
                        <div class="chat-more-tool-icon">{{ tool.icon }}</div>
                        <div class="chat-more-tool-label">{{ tool.name }}</div>
                    </div>
				</div>
			</el-scrollbar>
		</div>
	</div>
</template>

<script>
	export default {
		name: "chat-tool",
		data() {
			return {
				show: false,
				pos: {
					x: 0,
					y: 0
				}
			}
		},
		methods: {
			onClickTool(text) {
				this.$emit('chatMoreTool', text)
			},
			open(pos) {
				this.pos = pos;
				this.show = true;
			},
			close() {
				this.show = false;
			}
		},
		computed: {
			x() {
				return this.pos.x;
			},
			y() {
				return this.pos.y - 280;
			}
		}
	}
</script>

<style scoped lang="scss">
	.chat-tool-box {
		position: fixed;
		width: 200px;
		box-sizing: border-box;
		padding: 5px;
		border: 1px solid #b4b4b4;
		border-radius: 5px;
		background-color: #f5f5f5;
		box-shadow: 0px 0px 10px #ccc;

		.chat-tool-item-list {
			display: flex;
			flex-wrap: wrap;
            justify-content: center; /* 水平居中 */
            align-items: center;     /* 垂直居中（如果需要） */
            gap: 24px;

			.chat-more-tool-item {
                width: 72px;
                height: 90px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background: #fff;
                border-radius: 12px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                cursor: pointer;
                transition: box-shadow 0.2s;

                .chat-more-tool-icon {
                    font-size: 32px;
                    margin-bottom: 8px;
                }

                .chat-more-tool-label {
                    font-size: 14px;
                    color: #333;
                }
            }
		}

		&:after {
			content: "";
			position: absolute;
			left: 0px;
			bottom: -30px;
			width: 0;
			height: 0;
			border-style: solid dashed dashed;
			border-color: #f5f5f5 transparent transparent;
			overflow: hidden;
			border-width: 15px;
		}
	}

    




</style>