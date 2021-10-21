import { ShapeFlags } from '../shared/types'
import { createApp } from './apiCreateApp'

/**
 * @param renderOptions 不同平台的 api 操作，来自runtime-dom
 */
export function createRenderer(renderOptions: {}) {
  const updateComponent = (vnode1, vnode2, container) => {}
  const mountComponent = (vnode2, container) => {
    // 1. 创建实例
    let instance = (vnode2.component = createComponentInstance(vnode2))

    // 2. 拿出实例中的 setup 执行，把props、ctx传过去
    let { setup } = instance.type
    if (setup) {
      // 3. 创建好 ctx
      let ctx = createSetupContext(instance)
      let setupResult = setup(instance.props, ctx)
    }
  }

  const handleComponent = (vnode1, vnode2, container) => {
    if (vnode1 == null) {
      mountComponent(vnode2, container)
    } else {
      updateComponent(vnode1, vnode2, container)
    }
  }

  // patch里判断vnode类型，根据不同类型，触发不同方法去处理
  const patch = (vnode1, vnode2, container) => {
    const { shapeFlag } = vnode2

    if (shapeFlag & ShapeFlags.ELEMENT) {
      // 包含元素
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
    subTree: null
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
