import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 配置按需引入后，将不允许直接导入所有组件
import Vant from 'vant'
import 'vant/lib/index.css'

createApp(App)
  .use(Vant)
  .use(store)
  .use(router)
  .mount('#app')
