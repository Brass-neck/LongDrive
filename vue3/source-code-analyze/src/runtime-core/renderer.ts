import { ShapeFlags } from '../shared/types'
import { createApp } from './apiCreateApp'
import { isFunction } from '../utils/index'

/**
 * @param renderOptions 不同平台的 api 操作，来自runtime-dom
 */
export function createRenderer(renderOptions: {}) {
  const updateComponent = (vnode1, vnode2, container) => {}

  /******************** handleElement *********************/
  const mountChildren = (children, container) => {
    for (let i = 0; i < children.length; i++) {
      patch(null, children[i], container)
    }
  }

  // 生成真实dom
  const mountElement = (vnode, container) => {
    const { type, props, children, shapeFlag } = vnode

    let el = (vnode.el = renderOptions.createElement(type))

    if (props) {
      for (const key in props) {
        renderOptions.setProp(el, key, props[key])
      }
    }

    // 设置完父亲，设置孩子
    if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      // 孩子是数组，递归
      mountChildren(children, el)
    } else if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      // 孩子是文本，直接设置
      renderOptions.setText(el, children)
    }

    renderOptions.appendChild(el, container)
  }

  const handleElement = (vnode1, vnode2, container) => {
    if (vnode1 == null) {
      // 首次挂载元素
      mountElement(vnode2, container)
    } else {
      // dom diff 算法
    }
  }
  /******************** handleElement *********************/

  /******************** handleComponent *********************/
  // 执行 h函数
  const setupRenderer = (instance, container) => {
    if (!instance.isMounted) {
      let subTree = (instance.subTree = instance.render())

      patch(null, subTree, container)
      instance.isMounted = false
    } else {
      console.log('修改了数据')
    }
  }

  // 创建组件实例，并执行setup得到h函数
  const mountComponent = (vnode2, container) => {
    // 1. 创建实例
    let instance = (vnode2.component = createComponentInstance(vnode2))

    // 2. 拿出实例中的 setup 执行，把props、ctx传过去
    let { setup } = instance.type
    if (setup) {
      // 3. 创建好 ctx
      let ctx = createSetupContext(instance)
      // 结果可能是一个对象，是给模板使用的数据
      // 可能是一个函数，那就是 h函数，执行 h 函数 得到 虚拟节点
      let setupResult = setup(instance.props, ctx)
      if (isFunction(setupResult)) instance.render = setupResult

      // 执行 h函数
      setupRenderer(instance, container)
    }
  }

  const handleComponent = (vnode1, vnode2, container) => {
    if (vnode1 == null) {
      mountComponent(vnode2, container)
    } else {
      updateComponent(vnode1, vnode2, container)
    }
  }
  /******************** handleComponent *********************/

  // patch里判断vnode类型，根据不同类型，触发不同方法去处理
  const patch = (vnode1, vnode2, container) => {
    const { shapeFlag } = vnode2

    if (shapeFlag & ShapeFlags.ELEMENT) {
      // 包含元素，那就走处理元素的方法
      handleElement(vnode1, vnode2, container)
    } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
      // 包含组件，那就走处理组件的方法
      handleComponent(vnode1, vnode2, container)
    }
  }

  // 根据虚拟节点生成真实节点，放到container中
  const render = (vnode, container) => {
    // 首次渲染，老的vnode = null
    patch(null, vnode, container)
  }

  return {
    render,
    createApp: createApp(render)
  }
}

// 创建实例，挂载到页面
let uid = 0
function createComponentInstance(vnode) {
  const instance = {
    uid: uid++,
    vnode,
    type: vnode.type,
    props: {},
    slots: {},
    attrs: {},
    setupState: {},
    ctx: {},
    isMounted: false,
    subTree: null,
    render: null
  }
  return instance
}

// 创建setup函数中的 上下文ctx
function createSetupContext(instance) {
  return {
    attrs: instance.attrs,
    slots: instance.slots,
    emit: instance.emit,
    expose: () => {}
  }
}
