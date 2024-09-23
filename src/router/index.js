import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home'

Vue.use(VueRouter)

// 配置导出路由
export default new VueRouter(
  {
    routes: [
      {
        path: "/", 
        redirect: "/home"
      },
      {
        name: "Home",
        path: "/home",
        component: Home,
        children: [
          {
            name: "Friend",
            path: "/home/friend",
            component: () => import("../views/Friend")
          },
          {
            name: "Chat",
            path: "/home/chat",
            component: () => import("../views/Chat")
          },
          {
            name: "Group",
            path: "/home/group",
            component: () => import("../views/Group")
          }
        ]
      }
    ]
  }
)

