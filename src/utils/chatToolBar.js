const tools = [
  { name: '发红包', icon: '🧧', action: 'sendRedPacket' },      // 微信红包专属
  { name: '转账', icon: '💸', action: 'transfer' },        // 转账
  { name: '收付款', icon: '💳', action: 'payment' },      // 收付款
  { name: '位置', icon: '📍', action: 'sendLocation' },        // 位置
  { name: '语音通话', icon: '📞', action: 'voiceCall' },    // 语音通话
  { name: '视频通话', icon: '🎥', action: 'videoCall' },    // 视频通话
  { name: '收藏', icon: '⭐', action: 'favorite' },        // 收藏
  { name: '名片', icon: '👤', action: 'sendCard' },        // 名片
  { name: '文件', icon: '📄', action: 'sendFile' },        // 文件
  { name: '拍照', icon: '📷', action: 'takePhoto' },        // 拍照
  { name: '相册', icon: '🖼️', action: 'sendAlbum' },       // 相册
  { name: '日程', icon: '📅', action: 'sendSchedule' }         // 日程
];

export default {
	tools
}
