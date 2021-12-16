import { createStore, applyMiddleware } from 'redux'
import reducer from './reducer'
import createSagaMiddleware from 'redux-saga'
import rootSaga from './sagas'

// 创建 saga 中间件
let sagaMiddleware = createSagaMiddleware()

// store 应用中间件
let store = applyMiddleware(sagaMiddleware)(createStore)(reducer)

// 执行 rootSaga
sagaMiddleware.run(rootSaga)

export default store
