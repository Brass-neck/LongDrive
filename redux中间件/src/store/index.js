import { createStore, applyMiddleware } from 'redux'
import reducer from './reducer'
import rootSaga from './sagas'

import createSagaMiddleware from 'redux-saga'

import { routerMiddleware } from 'connect-react-router'
import history from '../history'

// 创建 saga 中间件
let sagaMiddleware = createSagaMiddleware()

// 创建 connect-react-router 中间件
let createdRouterMiddleware = routerMiddleware(history)

// store 应用中间件
let store = applyMiddleware(sagaMiddleware, createdRouterMiddleware)(createStore)(reducer)

// 执行 rootSaga
sagaMiddleware.run(rootSaga)

export default store
