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
