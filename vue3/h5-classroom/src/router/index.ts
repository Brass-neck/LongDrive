import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/home/index.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/mine',
    name: 'Mine',
    //todo: 代码分割原理： jsonp，异步加载的js文件名称就是这里魔法注释决定的
    component: () => import(/* webpackChunkName: "mine" */ '../views/mine/index.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import(/* webpackChunkName: "profile" */ '../views/profile/index.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
