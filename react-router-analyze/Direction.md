# 描述

本项目主要是研究 React 路由的使用难点与路由的原理

# 重点记录

### 什么是路由？

路由就是不同的路径渲染不同的组件，它有两种实现方式：

1. HashRouter：利用 hash 实现路由切换
2. BrowserRouter：利用 H5 新特性 history 实现路由切换

   ```js
   history.pushState()
   history.replaceState()

   window.onpopstate 是 window自带的
   该事件会在调用浏览器的 前进、后退以及执行 history.forward、history.back、history.go 触发，
   因为这些操作都有一个共性，就是改变了浏览器历史堆栈的当前指针

   注意：history.pushState() 不会触发 window.onpopstate，并且 onpushstate 也不是自带的事件，需要我们自己实现

   // 重写history.pushState，使其可以触发 onpushstate 事件
   (function(history){
     let oldPushState = history.pushState
     history.pushState = function(state,title,pathname){
       let result = oldPushState.aplly(this, state,title,pathname)
       if(typeof window.onpushstate === 'function') window.onpushstate({type: 'pushstate', state})
     }
   })(window.history);

   // 结果是？
   history.pushState({page: 1}, null, '/page1') // 历史栈中加一条，并成为新的栈顶
   history.pushState({page: 2}, null, '/page2') // 历史栈中加一条，并成为新的栈顶
   history.pushState({page: 3}, null, '/page3') // 历史栈中加一条，并成为新的栈顶
   history.back()                               // 回到 page2
   history.pushState({page: 4}, null, '/page4') // 历史栈中加一条，并成为新的栈顶，page3被删除
   history.go(1)                                // page4 已经是栈顶，继续往前还是 page4
   ```

<hr>

### 注意

vue、react 的单页应用，如果是 history 模式 ，刷新页面会 404，因为刷新会向服务器发起 http 请求，服务器找不到这个路径就报错 404，所以服务器需要配置 重定向 到 index.html

hash 模式不会 404，因为路径是 index.html/#/a，刷新后也是 index.html，哈希部分是前端锚点，不会带给后端

<hr>

### 路由库的关系

react-router 是路由的基础库，是跨平台的，可以搭配不同平台，比如 dom、canvas、native 等

react-router-canvas

react-router-native

react-router-dom = react-router + history 库

- react-router-dom 的 HashRouter（和 BrowserRouter 唯一不同就是 history 对象）

  - 引用 react-router 的 Router，Router 引用 RouterContext 容器，Router 作为 Provider，提供 value ，包含 history、location、match
  - 引用 history 的 createHashHistory 得到 history，传给 react-router 的 Router

- react-router-dom 的 BrowserRouter（和 HashRouter 唯一不同就是 history 对象）

<hr>
