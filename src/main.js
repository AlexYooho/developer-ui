import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import httpRequest from './utils/httpRequest'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import * as  date from './utils/date.js'
import emotion from './utils/emotion.js';
import * as socketApi from './utils/wssocket.js'
import * as enums from './utils/enums.js'
import "./assets/iconfont/iconfont.css"
import element from "./utils/element.js"
import api from "./api/api.js"
import chatToolBar from './utils/chatToolBar.js'

Vue.use(ElementUI);

Vue.prototype.$wsApi = socketApi;
Vue.prototype.$date = date;
Vue.prototype.$http = httpRequest // http请求方法
Vue.prototype.$api = api // http请求方法
Vue.prototype.$emo = emotion; // emo表情
Vue.prototype.$elm = element; // 元素操作
Vue.prototype.$enums=enums;//枚举
Vue.config.productionTip = false;
Vue.prototype.$chatToolBar = chatToolBar; // 聊天工具栏

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
