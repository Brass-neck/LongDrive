/**
 * redux-saga/effects 原理
 */

export function take(actionType) {
  return { type: 'TAKE', actionType }
}

export function put(action) {
  return { type: 'PUT', action }
}

export function select(selector, ...args) {
  return { type: 'SELECT', selector(...args) }
}

// 创建一个 Effect 描述信息，用来命令 middleware 以 非阻塞调用 的形式执行 fn
// fork 意味着 开启一个新的子进程，来执行 fn
export function fork(fn, ...args){
  return {type: 'FORK',fn: fn.bind(null, ...args)}
}

export function takeEvery(pattern, saga){
  function* takeEveryHelper(){
    while(true){
      yield take(pattern)
      yield fork(saga)
    }
  }
  fork(takeEveryHelper)
}

export function cancel(task){
  return {type: 'CANCEL', task}
}