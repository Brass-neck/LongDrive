/**
 *
 * createApp(<App />, {prop1: 1}).mount('#app')
 * 参数二：可以给组件传参
 *
 * 1. 用户传入组件和属性
 * 2. 创建虚拟节点
 * 3. 将虚拟节点变为真实节点
 *
 */

import { createRenderer } from '../runtime-core/renderer'

let renderOptions = {
  // 这里是所有的 dom API，传给runtime-core给它调用
}

function createApp(rootComponent, rootProps = null) {
  // renderOptions是针对不同平台的api操作，传给核心模块 runtime-core，它返回一个 app，包含render和createApp
  let { render, createApp } = createRenderer(renderOptions)
  let app = createApp(rootComponent, rootProps)
  let { mount } = app

  // 在runtime-dom中重写mount，对浏览器中的容器进行清空
  app.mount = function (container) {
    container.innerHTML = ''
    mount(container)
  }
  return app
}
