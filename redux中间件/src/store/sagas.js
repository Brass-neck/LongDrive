// take 只监听一次，相当于 once
import { take, put } from 'redux-saga/effects'

export default function* rootSaga() {
  // take 表示：在等待一个 type=ASYNC_ADD 的 action 发到仓库，等到才往后执行；等不到就卡在这里
  // 这是一个 watcher saga
  yield take('ASYNC_ADD')

  // put 表示：向仓库派发一个 type=ADD 的 action
  // 这是一个 worker saga
  yield put({ type: 'ADD' })
}

/**
 * 拆分版本
 */

function* watcherSaga() {
  yield take('ASYNC_ADD')
  yield workerSaga()
}

function* workerSaga() {
  yield put({ type: 'ADD' })
}

function* rootSaga2() {
  console.log('rootSaga start')
  // 开启一个新的saga，相当于开启了新的进程，新的进程和本进程无关
  // 所以，执行了 rootSaga2，start 和 end 都会 打印，并不会被 watcherSaga 里的 take 阻塞
  yield watcherSaga()
  console.log('rootSaga end')
}
