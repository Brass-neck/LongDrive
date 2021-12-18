/**
 * saga 中间件 run 方法，接收 rootSaga，将 rootSaga 进行自动迭代
 * @param {*} rootSaga
 */

function run(rootSaga) {
  // rootSaga 是一个 generator 函数
  let iterator = rootSaga()

  function next() {
    const { value, done } = iterator.next()
    // 处理 value
    // value 就是一个 effect，effect有不同的 type ，比如 'PUT'、'TAKE'等等，他们的功能不同
    console.log(value)

    // 如果 yield 一个 异步，需要单独处理，在 then 之后 才调用 next
    if (value instanceof Promise) {
      value.then(() => {
        if (!done) next()
      })
    } else {
      if (!done) next()
    }
  }

  next()
}

/**
 * redux中应用中间件的方法
 * @param {*} middleware
 *
 * import { createStore, applyMiddleware } from 'redux'
 * let store = applyMiddleware(logger)(createStore)(reducer)
 *
 * applyMiddleware 就是让原始的store.dispatch，执行一系列的中间件改造，最终得到一个加强版的dispatch，赋给store
 */

// 简单理解版本
function applyMiddleware(middleware) {
  return function (createStore) {
    return function (reducer) {
      // 创建 store
      let store = createStore(reducer)

      // 执行middleware，改造dispatch
      let newDispatch = middleware(store)(store.dispatch)

      // 返回新的 store
      return {
        ...store,
        dispatch: newDispatch
      }
    }
  }
}

// 完整版本 start

// 把传入的函数数组从前往后进行嵌套调用
// 源码版本
function compose(...funcs) {
  if (funcs.length === 0) return (arg) => arg
  if (funcs.length === 1) return funcs[0]

  return funcs.reduce(
    (a, b) =>
      (...args) =>
        a(b(...args))
  )
}

// 简单理解版本
// compose2(add1, add2, add3)('hello')
function compose2(...funcs) {
  return function (args) {
    for (let i = funcs.length - 1; i >= 0; i--) {
      args = funcs[i](args)
    }
    return args
  }
}

function applyMiddleware(...middlewares) {
  return (createStore) => (reducer, preloadedState, enhancer) => {
    let store = createStore(reducer, preloadedState, enhancer)
    let dispatch = store.dispatch

    const middlewareAPI = {
      getState: store.getState,
      dispatch: (action) => dispatch(action)
    }

    // 处理 middlewares
    let chain = []
    chain = middlewares.map((m) => m(middlewareAPI))

    dispatch = compose(...chain)(store.dispatch)

    return {
      ...store,
      dispatch
    }
  }
}
// 完整版本 end

/**
 * 日志中间件例子
 *
 * 每个中间件都会以 `dispatch` and `getState` 方法作为参数，最后返回一个新的 dispatch 方法
 */
function logger({ getState, dispatch }) {
  return function (next) {
    // 返回一个新的 dispatch 方法
    return function (action) {
      console.log('prev state', getState())
      next(action)
      console.log('next state', getState())
    }
  }
}

let store = applyMiddleware(logger)(createStore)(reducer)

/**
 * 创建 saga 中间件的方法（redux中间件就是改造dispatch方法）
 *
 * @return - 返回一个 saga 中间件，中间件是一个3层函数，第一层参数是 store，第二层参数是 next（dispatch），最后一层是改造后的dispatch
 * saga 中间件，有一个run方法，接收sagas迭代器并自动迭代
 */

import runSaga from './runSaga'

function createSagaMiddleware() {
  let boundRunSaga

  function sagaMiddleware({ getState, dispatch }) {
    let env = { getState, dispatch }
    boundRunSaga = runSaga.bind(null, env)

    // 返回一个中间件
    return function (next) {
      return function (action) {
        // 这里改写了 dispatch 的逻辑

        // 1. 先走原先的 dispatch 逻辑
        let result = next(action)

        // 2. 向仓库 dispatch action 会触发 take 的相关监听，channel需要emit，去触发 迭代器的next往下走
        channel.emit(action)
        return result
      }
    }
  }

  sagaMiddleware.run = (saga) => boundRunSaga(saga)

  return sagaMiddleware
}

// ./runSaga
function runSaga(env, saga) {
  let { getState, dispatch } = env
  let it = saga()

  function next() {
    let { value: effect, done } = it.next()
    if (!done) {
      // 这里处理各种不同逻辑，比如 put、take返回的指令对象
      switch (effect.type) {
        case 'TAKE':
          // take是监听一次动作，动作发生了，才往后走next
          // saga 里 是通过 channel 进行 发布/订阅
          channel.once(effect.actionType, next)
          break

        case 'PUT':
          // put 是 直接向 仓库 派发 action
          dispatch(effect.action)
          next()
          break
        default:
          break
      }
    }
  }

  next()
}
