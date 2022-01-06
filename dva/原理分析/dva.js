/**
 * dva原理分析
 *
 */

import React from 'react'
import { Provider, connect } from 'react-redux'

function dva() {
  const app = {
    _model: [], // 存放model的容器
    model, // 往 _model 里加 model 的方法
    _router: null, // 存放 router 的容器
    router, // 往 _router 里 加 router 的方法
    start // 开启渲染
  }

  function model(modelObj) {
    app._model.push(modelObj)
  }

  return app
}

export { connect }
export default dva
