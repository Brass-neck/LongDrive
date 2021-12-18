///////////////////////////////通过 push等方法派发action跳转路径///////////////////////////////////

/**
 * connected-react-router 的 push 方法
 * 返回一个 actions 对象，以供 connected-react-router 中间件拦截处理
 *
 * @returns {type, payload}
 */

const CALL_HISTORY_METHOD = '@@router/CALL_HISTORY_METHOD'

function push(path) {
  return {
    type: CALL_HISTORY_METHOD,
    payload: {
      method: 'push',
      path
    }
  }
}

/**
 * connected-react-router 中间件方法
 * 解析 push 等方法传递的 action，并跳转路由
 *
 * @param {*} history
 * @returns 改造后的dispatch
 */
function routerMiddleware(history) {
  return function (middlewareAPI) {
    return function (next) {
      return function (action) {
        if (action.type === CALL_HISTORY_METHOD) {
          const {
            payload: { method, path }
          } = action
          history[method](path)
        } else {
          next(action)
        }
      }
    }
  }
}

////////////////////////////////监听路由变化，并同步到redux仓库///////////////////////////////////////

import React, { Component } from 'react'
import { Router } from 'react-router'
import store from '../src/store'

export default class ConnectedRouter extends Component {
  constructor(props, context) {
    super(props)
    // history 的 listen方法 监听 路由变化，返回值是解除监听的方法
    this.unlisten = props.history.listen((location, action) => {
      store.dispatch({
        type: LOCATION_CHANGE,
        payload: {
          location,
          action
        }
      })
    })
  }

  // 解除监听
  componentWillUnmount() {
    this.unlisten()
  }

  render() {
    return <Router history={this.props.history}>{this.props.children}</Router>
  }
}
