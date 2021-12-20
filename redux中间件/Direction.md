# 描述

本项目研究 redux 各种中间件的使用与原理

# 关于迭代器的知识

```js
function* gen() {
  yield 1
  yield 2
  yield 3
  yield 4
}

let it = gen()
it.next() // {value: 1, done: false}

// 抛出错误，后面的都不能再执行了
it.throw('抛出错误')
it.next() // {value: undefined, done: true}

// 提前结束，后面的都不能再执行了
it.return('提前结束') // {value: '提前结束', done: true}
it.next() // {value: undefined, done: true}
```

# 关于中间件的知识

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

但是我们有一个更优雅的写法，类似于 **洋葱模型**，中间件都是这个固定写法

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

# redux-saga

`redux-saga` 是一个 redux 的中间件，可以增强 redux 的功能，用于处理复杂的异步问题，可以进行复杂的流程管理（简单的流程可以使用 `redux-thunk` 管理）

### 工作原理

saga 里使用 `Generator` 函数 来 `yield` `effect`指令对象，用到了 `co库`

- generator 函数的作用是**可以暂停执行**，再次执行的时候从上次暂停的地方继续执行
- Effect 是一个简单对象，包含了一些给 middleware 解释执行的信息
- 可以通过 effect API 比如 fork、call、take、put、cancel 来创建 effect

<hr>

### saga 的分类

- worker saga 做工作的 sage，比如进行异步请求、获取异步封装结果等
- watcher saga，监听被 dispatch 的 action，当接收到 action 或者知道其被触发时，调用 worker 执行任务
- root saga 唯一的入口 saga

<hr>

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

<hr>

### select

创建一个 Effect，用来命令 middleware 在当前 Store 的 state 上调用指定的选择器

如果调用 select 的参数为空（即 `yield select()`），那么 effect 会取得完整的 state（与调用 `getState()` 的结果相同）

```js
import { select } from 'redux-saga/effects'
const number = yield select(state => state.number)
```

<hr>

### fork

创建一个 Effect 描述信息，用来命令 middleware 以 **非阻塞调用** 的形式执行 fn

- fork 意味着 开启一个 **新的子进程（子进程是一个比喻）**，来执行 fn

- 返回值是一个 **task**（Task 接口）

<hr>

### takeEvery(pattern, saga)

在 dispatch action 到 Store 的时候，匹配 pattern 的每一个 action 都会派生一个 saga，也就是无限次的 take **（take 只触发一次，相当于 once，takeEvery 会被触发无限次）**

```js
// takeEvery 是高级 API，是由基础的辅助函数构建的
// takeEvery 是由 take 和 fork 构建的
const takeEvery = (patternOrChannel, saga, ...args) =>
  fork(function* () {
    while (true) {
      const action = yield take(patternOrChannel)
      yield fork(saga, ...args.concat(action))
    }
  })
```

<hr>

### Task（接口）

Task 接口指定了通过 `fork`，`middleare.run` 或 `runSaga` 运行 Saga 的结果

<hr>

### cancel(task)

创建一个 Effect 描述信息，用来命令 middleware 取消之前的一个分叉任务

```js
function* mySaga() {
  const task = yield fork(myApi)
  // ... 过一会儿儿
  // 将会调用 myApi 上的 promise[CANCEL]
  yield cancel(task)
}
```

# redux-thunk

redux 的 dispatch 原先只可以派发一个**纯对象**，使用了 redux-thunk 可以允许我们的 dispatch 派发一个函数，实现异步

# redux-promise

1. 允许我们 dispatch 一个 promise，但是这个 promise 成功、失败都会走原始的 dispatch，无法单独处理 reject 的情况

2. 允许我们 dispatch 一个 对象， 但是对象的 payload 是一个 promise，可以单独处理 reject 的情况

# connected-react-router

- 描述：连接 redux 仓库 和 路由

- 核心作用：

  1. 通过派发动作，来跳转路径
  2. 把 路径信息 保存到 redux 仓库中（数据同步）

- 原理描述：

  1. 通过 push 等方法派发 action 来跳转路由
     通过 `connected-react-router` 中的 push 等方法跳转路径，push 方法会返回 actions 对象，应用 connected-react-router 的 `routerMiddleware` 中间件后，就可以拦截和解析 push 方法返回的 actions 对象，并且进行路由跳转

  2. 同步路由数据到仓库
     在`ConnectedRouter`组件中，通过 `history.listen`监听路由变化，并使用`store.dispatch(LOCATION_CHANGE)`把最新的路由更新到仓库中
     在`connectRouter`这个 reducer 中，处理上一步的`LOCATION_CHANGE`action，更新仓库的 state
