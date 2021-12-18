/**
 * redux-thunk 中间件的原理
 *
 * redux-thunk 可以允许 dispatch 派发一个函数，实现异步
 */

function thunk({ getState, dispatch }) {
  return function (next) {
    return function (action) {
      // 使 dispatch 支持 函数
      if (typeof action === 'function') {
        return action(getState, dispatch)
      }
      return next(action)
    }
  }
}

/**
 * redux-promise 中间件的原理
 *
 * 1. 允许 dispatch 一个 promise
 * 2. 允许 dispatch 一个 对象， 但是 payload 是一个 promise
 */
function promise({ getState, dispatch }) {
  return function (next) {
    return function (action) {
      // 如果有 then 并且 then 是一个函数，那么判断为一个 promise

      if (action.then && typeof action.then === 'function') {
        //here: action 中的 promise 成功 失败 都走 dispatch，无法单独处理reject的情况
        return action.then(dispacth).catch(dispatch)
      } else if (action.payload && typeof action.payload.then === 'function') {
        // payload 是一个 promise
        //here: 可以单独处理reject的情况
        action.payload
          .then((payload) => dispatch({ ...action, payload }))
          .catch((err) => {
            dispatch({ ...action, error: true, payload: err })
            return Promise.reject(err)
          })
      }
      // 如果都不是，就走原始的dispatch
      return next(action)
    }
  }
}
