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
function compose(...funcs) {
  if (funcs.length === 0) return (arg) => arg
  if (funcs.length === 1) return funcs[0]

  return funcs.reduce(
    (a, b) =>
      (...args) =>
        a(b(...args))
  )
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
