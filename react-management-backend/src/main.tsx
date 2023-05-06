import React from 'react'
import ReactDOM from 'react-dom/client'

// 初始化样式放在最前面，后面引入的样式会覆盖初始化样式
import 'reset-css'

// UI框架样式
// 这里是把所有组件的样式都引入了，而我们想要的是，用什么组件，按需引入什么组件的样式
// import 'antd/dist/antd.css'
// 把这里的样式引入注释掉，通过配置 vite-plugin-style-import 插件 按需引入

// 全局样式
import '@/assets/style/global.scss'

// 组件样式
import App from './App'

// 路由
import { BrowserRouter } from 'react-router-dom'

// redux
import { Provider } from 'react-redux'
import store from '@/store'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
)
