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

/**
 * ./runSaga 文件，即 sagaMiddleware 的 run 方法
 *
 * @param {*} env
 * @param {*} saga
 * @returns 返回一个 task
 */
function runSaga(env, saga) {
  let { getState, dispatch } = env
  let it = typeof saga === 'function' ? saga() : saga

  // 返回值是一个 task，符合 Task 接口标准，next逻辑中会进行特殊字符的判断
  let task = {
    cancel: () => next('CANCEL_TASK')
  }

  function next(value) {
    let result

    // 判断特殊字符
    if (value === 'CANCEL_TASK') {
      result = it.return(value)
    } else {
      result = it.next()
    }

    let { value: effect, done } = result

    if (!done) {
      // 1. 如果 yield watcherSaga()，effect就是一个 迭代器，那就需要递归 runSaga

      if (typeof effect[Symbol.iterator] === 'function') {
        runSaga(env, effect)
        next()
      } else {
        // 2. 如果 yield put(...)，effect就是一个 纯对象，只要按照纯对象的不同 type 进行处理即可

        switch (effect.type) {
          // 这里处理各种不同逻辑，比如 put、take返回的指令对象

          case 'TAKE':
            // take是监听一次动作，动作发生了，才往后走next
            // saga 里 是通过 channel 进行 发布/订阅
            channel.once(effect.actionType, next)
            // 这里没有 调用 next，会阻塞在这里，等待监听的事件发生，发生后才触发next
            break

          case 'PUT':
            // put 是 直接向 仓库 派发 action
            dispatch(effect.action)
            next()
            break

          case 'SELECT':
            let selectedState = effect.selector(getState())
            next(selectedState)

          case 'FORK':
            // 开启一个新的子进程（进程是一个比喻），执行fn，会返回一个 task
            let task = runSaga(env, effect.saga)
            next(task)
            break

          case 'CANCEL':
            effect.task.cancel()
            next()
            break

          default:
            break
        }
      }
    }
  }

  next()
  return task
}
