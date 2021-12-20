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
