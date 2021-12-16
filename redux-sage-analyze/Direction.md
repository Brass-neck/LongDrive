# 描述

本项目研究 redux-saga 的使用与原理

# 概述

`redux-saga` 是一个 redux 的中间件，可以增强 redux 的功能，用于处理复杂的异步问题，可以进行复杂的流程管理（简单的流程可以使用 `redux-thunk` 管理）

### 关于中间件的知识

redux 的中间件原理，其实就是改造 dispatch 方法

```js
let oldDispatch = store.dispatch

// 日志中间件 原理
store.dispatch = function () {
  console.log('old state', store.getState())
  oldDispatch()
  console.log('new state', store.getState())
  return action
}

// 异步操作中间件 原理
store.dispatch = function () {
  setTimeout(() => {
    oldDispatch()
  }, 1000)
  return action
}

// 发送异步请求 原理
store.dispatch = function () {
  fetch('/api/user')
    .then((res) => res.json())
    .then((res) => {
      console.log(res)
      oldDispatch()
    })
}
```

但是我们有一个更优雅的写法，类似于 **洋葱模型**

```js
// logger 原理
function logger({ getState, dispatch }) {
  return function (next) {
    // next表示调用下一个中间件，指向 store.dispatch
    return function (action) {
      // 这一层就是上面改造后的dispatch
      console.log('old state', store.getState())
      next(action)
      console.log('new state', store.getState())
    }
  }
}
```

# 工作原理

saga 里使用 `Generator` 函数 来 `yield` `effect`指令对象，用到了 `co库`

- generator 函数的作用是**可以暂停执行**，再次执行的时候从上次暂停的地方继续执行
- Effect 是一个简单对象，包含了一些给 middleware 解释执行的信息
- 可以通过 effect API 比如 fork、call、take、put、cancel 来创建 effect

# saga 的分类

- worker saga 做工作的 sage，比如进行异步请求、获取异步封装结果等
- watcher saga，监听被 dispatch 的 action，当接收到 action 或者知道其被触发时，调用 worker 执行任务
- root saga 唯一的入口 saga

# API

### take

`take(pattern)` 表示：用来命令 middleware 在 Store 上等待指定的 action，就是在等待一个 type = name 的 action 发到仓库，等到了才往后执行；等不到就卡在这里，一般是用于定义一个 watcher saga

- 如果以空参数或 '\*' 调用 take，那么将匹配所有发起的 action。（例如，take() 将匹配所有 action）

- 如果它是一个函数，那么将匹配 pattern(action) 为 true 的 action。（例如，take(action => action.entities) 将匹配那些 entities 字段为真的 action）

- middleware 提供了一个特殊的 action —— END。如果你发起 END action，则无论哪种 pattern，只要是被 take Effect 阻塞的 Sage 都会被终止。假如被终止的 Saga 下仍有分叉（forked）任务还在运行，那么它在终止任务前，会先等待其所有子任务均被终止

- take 只可监听一次，类似于 once

```js
let EventEmitter = require('events')
let e = new EventEmitter()

e.once('click', () => console.log('clicked'))
e.emit('click') // log('clicked')
e.emit('click') // 不打印，因为只触发一次
```

<hr>

### put

`put(action)` 表示：创建一个 Effect 描述信息，用来命令 middleware 向 Store 发起一个 action，也就是向仓库派发一个 action

- 这个 effect 是非阻塞型的，并且所有向下游抛出的错误（例如在 reducer 中），都不会冒泡回到 saga 当中

<hr>

### call

`call(fn, ...args)` 表示：创建一个 Effect 描述信息，用来命令 middleware 以参数 args 调用函数 fn
